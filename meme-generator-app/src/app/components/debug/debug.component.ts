import { Component, OnInit, ErrorHandler, Injectable, Injector, OnDestroy } from '@angular/core';
import { Router, NavigationError, NavigationStart, NavigationEnd, Event } from '@angular/router';
import { FederationDiagnosticService, FederationDiagnostic } from '../../services/federation-diagnostic.service';
import { Subscription } from 'rxjs';

// Custom error handler to capture Angular errors
@Injectable()
export class DebugErrorHandler implements ErrorHandler {
  private errors: any[] = [];

  constructor(private injector: Injector) {}

  handleError(error: any): void {
    this.errors.push(error);
    console.error('Debug Error Handler:', error);
    // Original error handling
    const originalErrorHandler = this.injector.get(ErrorHandler, null);
    if (originalErrorHandler && originalErrorHandler !== this) {
      // Call the original error handler if it exists and is not this handler
      try {
        originalErrorHandler.handleError(error);
      } catch (handlerError) {
        console.error('Error in original error handler', handlerError);
      }
    }
  }

  getErrors(): any[] {
    return this.errors;
  }
}

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss'],
  providers: [
    { provide: ErrorHandler, useClass: DebugErrorHandler }
  ]
})
export class DebugComponent implements OnInit, OnDestroy {
  errors: any[] = [];
  federationErrors: any[] = [];
  routingEvents: string[] = [];
  loadingEvents: string[] = [];
  federationDiagnostics: FederationDiagnostic[] = [];
  
  private subscriptions: Subscription = new Subscription();
  
  constructor(
    private router: Router,
    private errorHandler: ErrorHandler,
    private federationDiagnosticService: FederationDiagnosticService
  ) {
    // Monitor routing events
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.routingEvents.push(`Navigation started to: ${event.url}`);
      }
      if (event instanceof NavigationEnd) {
        this.routingEvents.push(`Navigation completed to: ${event.url}`);
      }
      if (event instanceof NavigationError) {
        this.routingEvents.push(`Navigation error: ${event.error}`);
        this.errors.push(event.error);
      }
    });
    
    // Monitor global errors
    window.addEventListener('error', (event) => {
      if (event.message.includes('Module Federation') || event.message.includes('Shared module')) {
        this.federationErrors.push({
          message: event.message,
          source: event.filename,
          lineno: event.lineno,
          timestamp: new Date().toISOString()
        });
      }
      this.errors.push({
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        timestamp: new Date().toISOString()
      });
    });
    
    this.logLoadEvent('Debug component constructor executed');
  }

  ngOnInit(): void {
    this.logLoadEvent('Debug component initialized');
    
    // Subscribe to federation diagnostics
    this.subscriptions.add(
      this.federationDiagnosticService.getDiagnostics().subscribe(diagnostics => {
        this.federationDiagnostics = diagnostics;
      })
    );
    
    // Check if we're in a module federation context
    try {
      this.logLoadEvent('Checking module federation status');
      if ((window as any).__webpack_share_scopes__) {
        this.logLoadEvent('Module federation detected');
        
        // Check which shared modules are available
        const sharedModules = Object.keys((window as any).__webpack_share_scopes__.default || {});
        this.logLoadEvent(`Available shared modules: ${sharedModules.join(', ')}`);
      } else {
        this.logLoadEvent('No module federation detected');
      }
    } catch (error) {
      this.logLoadEvent(`Error checking module federation: ${error}`);
      this.errors.push(error);
    }
    
    // Check if we're running in standalone mode or as a remote
    this.checkAppMode();
    
    // Add debug link to console for easy access
    this.addDebugLinkToConsole();
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.unsubscribe();
  }
  
  // Add public navigation method
  navigateToHome(): void {
    this.router.navigate(['/']);
  }
  
  checkAppMode(): void {
    const url = window.location.href;
    const isStandalone = url.includes(':4203');
    const isInShell = !isStandalone;
    
    this.logLoadEvent(`App running mode: ${isStandalone ? 'Standalone' : 'In Shell'}`);
    
    if (isInShell) {
      this.logLoadEvent('Running as a remote in the Frontend-Shell');
    }
  }
  
  addDebugLinkToConsole(): void {
    const baseUrl = window.location.origin;
    const debugUrl = baseUrl + '/debug';
    console.info(
      '%c Debug Tools Available 🐛 %c\n' + 
      'Click here for detailed diagnostics: ' + debugUrl,
      'background: #4285f4; color: white; padding: 2px 5px; border-radius: 3px;',
      'font-weight: bold;'
    );
  }
  
  logLoadEvent(event: string): void {
    const timestamp = new Date().toISOString();
    this.loadingEvents.push(`[${timestamp}] ${event}`);
    console.log(`DEBUG: ${event}`);
  }
  
  // Access the errors from the ErrorHandler
  getHandledErrors(): any[] {
    if (this.errorHandler instanceof DebugErrorHandler) {
      return (this.errorHandler as DebugErrorHandler).getErrors();
    }
    return [];
  }
  
  // Get color class based on diagnostic type
  getDiagnosticClass(type: string): string {
    switch (type) {
      case 'error': return 'diagnostic-error';
      case 'warning': return 'diagnostic-warning';
      case 'info': return 'diagnostic-info';
      default: return '';
    }
  }
}
