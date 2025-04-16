import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FederationDebugInfo {
  timestamp: string;
  type: 'info' | 'warn' | 'error';
  message: string;
  details?: any;
  url: string;
}

/**
 * A service dedicated to debugging Module Federation issues
 */
@Injectable({
  providedIn: 'root'
})
export class FederationDebugService {
  private readonly DEBUG_STORAGE_KEY = 'federation_debug_logs';
  private debugLogs: any[] = [];
  private debugSubject = new BehaviorSubject<any[]>([]);
  private networkMetrics: Map<string, { attempts: number, failures: number, avgLoadTime: number }> = new Map();

  constructor() {
    this.loadLogsFromStorage();
    this.setupGlobalErrorHandlers();
  }

  /**
   * Get an observable of federation debug logs
   */
  getLogs(): Observable<FederationDebugInfo[]> {
    return this.debugSubject.asObservable();
  }

  /**
   * Log federation debug information
   */
  debugLog(type: 'info' | 'warn' | 'error', message: string, details?: any): void {
    const info: FederationDebugInfo = {
      timestamp: new Date().toISOString(),
      type,
      message,
      details,
      url: window.location.href
    };

    this.debugLogs.push(info);
    this.saveLogsToStorage();
    this.debugSubject.next([...this.debugLogs]);
    
    // Also log to console with appropriate styling
    const style = type === 'error' 
      ? 'background: #ff0000; color: #ffffff'
      : type === 'warn'
        ? 'background: #ff9800; color: #000000'
        : 'background: #2196f3; color: #ffffff';
        
    console.log(`%c Federation Debug: ${message} `, style, details || '');
  }

  /**
   * Track module loading performance and failures
   */
  trackModuleMetrics(remoteName: string, loadTime?: number, failed: boolean = false) {
    const metrics = this.networkMetrics.get(remoteName) || { attempts: 0, failures: 0, avgLoadTime: 0 };
    metrics.attempts++;
    if (failed) {
      metrics.failures++;
    }
    if (loadTime) {
      metrics.avgLoadTime = ((metrics.avgLoadTime * (metrics.attempts - 1)) + loadTime) / metrics.attempts;
    }
    this.networkMetrics.set(remoteName, metrics);
    
    this.debugLog('info', `Module metrics for ${remoteName}`, {
      ...metrics,
      successRate: ((metrics.attempts - metrics.failures) / metrics.attempts * 100).toFixed(2) + '%'
    });
  }

  /**
   * Check if Module Federation is properly initialized
   */
  checkFederationSetup(): void {
    setTimeout(() => {
      try {
        const windowKeys = Object.keys(window);
        const federationKeys = windowKeys.filter(k => 
          k.includes('meme_generator') || 
          k.includes('sos_update') || 
          k.includes('deployment_readiness') ||
          k.includes('f1TrackingApp') ||
          k.includes('webpack') || 
          k.includes('share')
        );
        
        this.debugLog('info', 'Module Federation objects in window', federationKeys);
        
        // Check if remoteEntry scripts are loaded
        const scripts = Array.from(document.querySelectorAll('script'))
          .filter(s => s.src && s.src.includes('remoteEntry.js'));
          
        if (scripts.length === 0) {
          this.debugLog('warn', 'No remoteEntry.js scripts found in the document');
        } else {
          this.debugLog('info', 'remoteEntry.js scripts found', 
            scripts.map(s => s.src));
        }
        
        // Check for webpack shared scope
        // @ts-ignore
        if (window.__webpack_share_scopes__?.default) {
          this.debugLog('info', 'Webpack shared scope found', 
            // @ts-ignore
            Object.keys(window.__webpack_share_scopes__.default));
        } else {
          this.debugLog('warn', 'Webpack shared scope not initialized');
        }
        
        // Check for remote containers
        const remotes = [
          { name: 'meme_generator', port: 4203 },
          { name: 'sos_update', port: 4201 },
          { name: 'deployment_readiness', port: 4202 },
          { name: 'f1TrackingApp', port: 4205 }
        ];
        
        remotes.forEach(remote => {
          // @ts-ignore
          if (window[remote.name]) {
            this.debugLog('info', `Remote ${remote.name} found`);
            // @ts-ignore
            if (typeof window[remote.name].get === 'function') {
              this.debugLog('info', `Remote ${remote.name} has get function`);
            } else {
              this.debugLog('warn', `Remote ${remote.name} missing get function`);
            }
            // @ts-ignore
            if (typeof window[remote.name].init === 'function') {
              this.debugLog('info', `Remote ${remote.name} has init function`);
            } else {
              this.debugLog('warn', `Remote ${remote.name} missing init function`);
            }
          } else {
            this.debugLog('warn', `Remote ${remote.name} not found in window object`, 
              { expectedUrl: `http://localhost:${remote.port}/remoteEntry.js` });
            
            // Check if we can connect to the remote
            this.checkRemoteEndpoint(`http://localhost:${remote.port}`, remote.name);
          }
        });
      } catch (err) {
        this.debugLog('error', 'Error during federation check', err);
      }
    }, 3000); // Wait 3 seconds to ensure scripts have had time to load
  }
  
  /**
   * Clear all debug logs
   */
  clearLogs(): void {
    this.debugLogs = [];
    this.saveLogsToStorage();
    this.debugSubject.next([]);
  }
  
  /**
   * Set up global error handlers to catch federation-related errors
   */
  private setupGlobalErrorHandlers(): void {
    // Capture unhandled Promise rejections that might be related to federation
    window.addEventListener('unhandledrejection', (event) => {
      if (this.isFederationError(event.reason)) {
        const details = {
          type: 'unhandledrejection',
          timestamp: new Date().toISOString(),
          message: event.reason?.message || String(event.reason),
          stack: event.reason?.stack,
          url: window.location.href
        };
        
        this.debugLog('error', 'Federation Promise Rejection', details);
      }
    });
    
    // Backup global error handler
    const originalOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      if (this.isFederationError(error || message)) {
        const details = {
          source,
          lineno,
          colno,
          errorMessage: error?.message || String(message),
          stack: error?.stack,
          url: window.location.href
        };
        
        this.debugLog('error', 'Federation Global Error', details);
      }
      
      // Call original handler if it exists
      if (typeof originalOnError === 'function') {
        return originalOnError.call(window, message, source, lineno, colno, error);
      }
      return false;
    };
  }
  
  /**
   * Check if an error is related to Module Federation
   */
  private isFederationError(error: any): boolean {
    if (!error) return false;
    
    const errorStr = typeof error === 'string' 
      ? error 
      : (error.message || '') + (error.stack || '');
      
    return errorStr.includes('Federation') || 
           errorStr.includes('remoteEntry') || 
           errorStr.includes('webpack') ||
           errorStr.includes('meme_generator') ||
           errorStr.includes('sos_update') ||
           errorStr.includes('deployment_readiness') ||
           errorStr.includes('f1TrackingApp');
  }
  
  /**
   * Check remote endpoint with additional diagnostics
   */
  private checkRemoteEndpoint(baseUrl: string, remoteName: string): void {
    const startTime = performance.now();
    fetch(`${baseUrl}/remoteEntry.js`)
      .then(async response => {
        const loadTime = performance.now() - startTime;
        const headerObj: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          headerObj[key] = value;
        });
        
        if (response.ok) {
          this.debugLog('info', `${remoteName} endpoint is available`, { 
            url: `${baseUrl}/remoteEntry.js`,
            loadTime: `${loadTime.toFixed(2)}ms`,
            headers: headerObj,
            status: response.status
          });
          this.trackModuleMetrics(remoteName, loadTime);
        } else {
          this.debugLog('warn', `${remoteName} endpoint returned status ${response.status}`, { 
            url: `${baseUrl}/remoteEntry.js`,
            loadTime: `${loadTime.toFixed(2)}ms`,
            headers: headerObj
          });
          this.trackModuleMetrics(remoteName, loadTime, true);
        }
      })
      .catch(err => {
        const loadTime = performance.now() - startTime;
        this.debugLog('error', `${remoteName} endpoint is not accessible`, { 
          url: `${baseUrl}/remoteEntry.js`,
          error: err.message,
          loadTime: `${loadTime.toFixed(2)}ms`
        });
        this.trackModuleMetrics(remoteName, loadTime, true);
      });
  }
  
  /**
   * Load logs from local storage
   */
  private loadLogsFromStorage(): void {
    try {
      const storedLogs = localStorage.getItem(this.DEBUG_STORAGE_KEY);
      if (storedLogs) {
        this.debugLogs = JSON.parse(storedLogs);
        this.debugSubject.next([...this.debugLogs]);
      }
    } catch (err) {
      console.error('Error loading federation debug logs from storage:', err);
    }
  }
  
  /**
   * Save logs to local storage
   */
  private saveLogsToStorage(): void {
    try {
      // Only keep the latest 100 logs to prevent storage issues
      const logsToSave = this.debugLogs.slice(-100);
      localStorage.setItem(this.DEBUG_STORAGE_KEY, JSON.stringify(logsToSave));
    } catch (err) {
      console.error('Error saving federation debug logs to storage:', err);
    }
  }
}