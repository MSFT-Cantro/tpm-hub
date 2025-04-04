import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ErrorLog {
  id: string;
  timestamp: string;
  type: 'angular' | 'javascript' | 'federation' | 'network' | 'router' | 'other';
  message: string;
  stackTrace?: string;
  componentStack?: string;
  source?: string;
  lineNumber?: number;
  columnNumber?: number;
  additionalInfo?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorLoggingService {
  private errorLogs = new BehaviorSubject<ErrorLog[]>([]);
  private readonly STORAGE_KEY = 'frontend-shell-error-logs';
  private maxLogSize = 100;
  
  constructor() {
    this.loadLogsFromStorage();
    this.setupGlobalErrorListeners();
  }

  /**
   * Get all error logs as an observable
   */
  getErrorLogs(): Observable<ErrorLog[]> {
    return this.errorLogs.asObservable();
  }

  /**
   * Log an Angular error
   */
  logAngularError(error: any, additionalInfo?: any): void {
    const errorLog: ErrorLog = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      type: 'angular',
      message: error.message || String(error),
      stackTrace: error.stack || null,
      additionalInfo
    };
    
    this.addErrorLog(errorLog);
  }

  /**
   * Log a JavaScript error
   */
  logJavaScriptError(error: ErrorEvent, additionalInfo?: any): void {
    const errorLog: ErrorLog = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      type: 'javascript',
      message: error.message,
      source: error.filename,
      lineNumber: error.lineno,
      columnNumber: error.colno,
      stackTrace: error.error?.stack,
      additionalInfo
    };
    
    this.addErrorLog(errorLog);
  }

  /**
   * Log a Module Federation specific error
   */
  logFederationError(message: string, additionalInfo?: any): void {
    const errorLog: ErrorLog = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      type: 'federation',
      message,
      additionalInfo
    };
    
    this.addErrorLog(errorLog);
  }

  /**
   * Log a network error (HTTP error, etc)
   */
  logNetworkError(error: any, additionalInfo?: any): void {
    const errorLog: ErrorLog = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      type: 'network',
      message: error.message || String(error),
      stackTrace: error.stack,
      additionalInfo: {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        ...additionalInfo
      }
    };
    
    this.addErrorLog(errorLog);
  }

  /**
   * Log any other type of error
   */
  logError(error: any, type: string = 'other', additionalInfo?: any): void {
    const errorLog: ErrorLog = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      type: type as any,
      message: typeof error === 'string' ? error : error.message || String(error),
      stackTrace: error.stack,
      additionalInfo
    };
    
    this.addErrorLog(errorLog);
  }

  /**
   * Special method to log routing-related errors
   */
  logRouterError(error: any, additionalInfo?: any): void {
    const errorLog: ErrorLog = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      type: 'router',
      message: error.message || String(error),
      stackTrace: error.stack,
      additionalInfo: {
        routerType: 'Angular Router',
        errorCode: error.code || 'unknown',
        ...additionalInfo
      }
    };
    
    this.addErrorLog(errorLog);
    
    // Special handling for common router issues
    if (error.message && error.message.includes('NG04007')) {
      console.warn('[Router Error] Multiple Router providers detected. This likely means RouterModule.forRoot() was used in a lazy loaded module. Use RouterModule.forChild() instead.');
    }
  }

  /**
   * Clear all error logs
   */
  clearLogs(): void {
    this.errorLogs.next([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.errorLogs.value, null, 2);
  }

  /**
   * Download logs as a file
   */
  downloadLogs(): void {
    const logs = this.exportLogs();
    const blob = new Blob([logs], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `frontend-shell-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  /**
   * Setup global error listeners
   */
  private setupGlobalErrorListeners(): void {
    // Listen for unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      // Check if it's a module federation related error
      if (
        event.message.includes('Shared module') ||
        event.message.includes('Module Federation') ||
        event.message.includes('webpack') ||
        event.message.includes('chunk loading') ||
        event.message.includes('remoteEntry.js')
      ) {
        this.logFederationError(event.message, {
          source: event.filename,
          lineNumber: event.lineno,
          columnNumber: event.colno
        });
      } else {
        this.logJavaScriptError(event);
      }
    });

    // Listen for unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason;
      const message = reason?.message || String(reason);
      
      // Check if it's federation related
      if (
        message.includes('Shared module') ||
        message.includes('Module Federation') ||
        message.includes('webpack') ||
        message.includes('chunk loading') ||
        message.includes('remoteEntry.js')
      ) {
        this.logFederationError(message, { reason });
      } else {
        this.logError(reason, 'promise', { unhandledRejection: true });
      }
    });
  }

  /**
   * Add an error log to the collection
   */
  private addErrorLog(log: ErrorLog): void {
    // Add to current logs
    const currentLogs = this.errorLogs.value;
    
    // Maintain max size by removing oldest logs if needed
    let newLogs = [log, ...currentLogs];
    if (newLogs.length > this.maxLogSize) {
      newLogs = newLogs.slice(0, this.maxLogSize);
    }
    
    this.errorLogs.next(newLogs);
    
    // Also log to console for immediate visibility
    console.error(`[ErrorLogging] ${log.type.toUpperCase()}: ${log.message}`, log);
    
    // Persist to localStorage
    this.saveLogsToStorage();
  }

  /**
   * Save logs to localStorage
   */
  private saveLogsToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.errorLogs.value));
    } catch (error) {
      console.error('Failed to save error logs to localStorage:', error);
    }
  }

  /**
   * Load logs from localStorage
   */
  private loadLogsFromStorage(): void {
    try {
      const savedLogs = localStorage.getItem(this.STORAGE_KEY);
      if (savedLogs) {
        const parsedLogs = JSON.parse(savedLogs) as ErrorLog[];
        this.errorLogs.next(parsedLogs);
      }
    } catch (error) {
      console.error('Failed to load error logs from localStorage:', error);
    }
  }

  /**
   * Generate a unique ID for each error
   */
  private generateErrorId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }
}