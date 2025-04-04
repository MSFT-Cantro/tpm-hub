import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FederationDiagnostic {
  timestamp: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  details?: any;
}

@Injectable({
  providedIn: 'root'
})
export class FederationDiagnosticService {
  private diagnostics = new BehaviorSubject<FederationDiagnostic[]>([]);
  private isInitialized = false;
  
  constructor() {
    this.initDiagnostics();
  }

  /**
   * Initialize diagnostics and start monitoring for federation issues
   */
  initDiagnostics(): void {
    if (this.isInitialized) {
      return;
    }
    
    this.logInfo('Federation diagnostic service initialized');
    
    // Check if we're in a Module Federation environment
    this.checkModuleFederationEnvironment();
    
    // Monitor for runtime errors that might be related to Module Federation
    this.setupErrorMonitoring();
    
    // Check version mismatches between host and remotes
    this.checkVersionCompatibility();
    
    this.isInitialized = true;
  }
  
  /**
   * Get diagnostics as an observable
   */
  getDiagnostics(): Observable<FederationDiagnostic[]> {
    return this.diagnostics.asObservable();
  }

  /**
   * Check if we're in a Module Federation environment
   */
  private checkModuleFederationEnvironment(): void {
    try {
      const windowAny = window as any;
      
      if (windowAny.__webpack_share_scopes__) {
        this.logInfo('Module Federation detected', { 
          shareScopes: Object.keys(windowAny.__webpack_share_scopes__) 
        });
        
        // Check for shared modules
        const defaultScope = windowAny.__webpack_share_scopes__.default;
        if (defaultScope) {
          const sharedModules = Object.keys(defaultScope);
          this.logInfo(`Found ${sharedModules.length} shared modules`, { modules: sharedModules });
          
          // Check status of important Angular modules
          this.checkModuleStatus('@angular/core');
          this.checkModuleStatus('@angular/common');
          this.checkModuleStatus('@angular/router');
          this.checkModuleStatus('rxjs');
        }
      } else {
        this.logWarning('Not running in a Module Federation environment');
      }
      
      // Check for webpack container entries
      if (windowAny.__webpack_require__) {
        this.logInfo('Webpack require detected');
      }
      
      if (windowAny.meme_generator) {
        this.logInfo('Running as remote: meme_generator');
      }
      
      // Detect if we're running in a shell
      const isInIframe = window !== window.parent;
      if (isInIframe) {
        this.logInfo('Application might be running in a shell (detected via iframe)');
      }
      
    } catch (error) {
      this.logError('Error checking Module Federation environment', error);
    }
  }

  /**
   * Check the status of a particular shared module
   */
  private checkModuleStatus(moduleName: string): void {
    try {
      const windowAny = window as any;
      const moduleEntry = windowAny.__webpack_share_scopes__?.default?.[moduleName];
      
      if (!moduleEntry) {
        this.logWarning(`Module "${moduleName}" not found in share scope`);
        return;
      }
      
      // Extract versions and check if module is available
      const versions = Object.keys(moduleEntry);
      const loadedVersions = versions.filter(v => moduleEntry[v]?.loaded);
      
      if (loadedVersions.length === 0) {
        this.logWarning(`Module "${moduleName}" is not loaded yet`, {
          availableVersions: versions,
        });
      } else {
        this.logInfo(`Module "${moduleName}" is loaded`, {
          loadedVersions: loadedVersions,
          allVersions: versions
        });
      }
      
    } catch (error) {
      this.logError(`Error checking module "${moduleName}"`, error);
    }
  }

  /**
   * Check for version mismatches between host and remotes
   */
  private checkVersionCompatibility(): void {
    try {
      const windowAny = window as any;
      const shareScope = windowAny.__webpack_share_scopes__?.default;
      
      if (!shareScope) return;
      
      // Common issue: Angular version mismatch
      if (shareScope['@angular/core']) {
        const angularVersions = Object.keys(shareScope['@angular/core']);
        if (angularVersions.length > 1) {
          this.logWarning('Multiple Angular Core versions detected', {
            versions: angularVersions
          });
        }
      }
      
    } catch (error) {
      this.logError('Error checking version compatibility', error);
    }
  }

  /**
   * Set up monitoring for runtime errors
   */
  private setupErrorMonitoring(): void {
    window.addEventListener('error', (event) => {
      // Filter for federation-related errors
      if (
        event.message.includes('Shared module') ||
        event.message.includes('Module Federation') ||
        event.message.includes('webpack') ||
        event.message.includes('chunk loading') ||
        event.message.includes('remoteEntry.js')
      ) {
        this.logError('Federation-related error caught', {
          message: event.message,
          source: event.filename,
          line: event.lineno,
          column: event.colno
        });
      }
    });
    
    // Monitor for unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason?.toString() || 'Unknown reason';
      if (
        reason.includes('Shared module') ||
        reason.includes('Module Federation') ||
        reason.includes('webpack') ||
        reason.includes('chunk loading') ||
        reason.includes('remoteEntry.js')
      ) {
        this.logError('Unhandled federation-related promise rejection', {
          reason: reason
        });
      }
    });
  }

  /**
   * Log diagnostic information 
   */
  private logDiagnostic(type: 'info' | 'warning' | 'error', message: string, details?: any): void {
    const diagnostic: FederationDiagnostic = {
      timestamp: new Date().toISOString(),
      type,
      message,
      details
    };
    
    const currentDiagnostics = this.diagnostics.value;
    this.diagnostics.next([...currentDiagnostics, diagnostic]);
    
    // Also log to console for easier debugging
    switch (type) {
      case 'info':
        console.log(`[Federation Diagnostic] ${message}`, details);
        break;
      case 'warning':
        console.warn(`[Federation Diagnostic] ${message}`, details);
        break;
      case 'error':
        console.error(`[Federation Diagnostic] ${message}`, details);
        break;
    }
  }
  
  logInfo(message: string, details?: any): void {
    this.logDiagnostic('info', message, details);
  }
  
  logWarning(message: string, details?: any): void {
    this.logDiagnostic('warning', message, details);
  }
  
  logError(message: string, details?: any): void {
    this.logDiagnostic('error', message, details);
  }
}
