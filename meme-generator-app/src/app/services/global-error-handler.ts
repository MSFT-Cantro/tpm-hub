import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ErrorLoggingService } from './error-logging.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    // Get ErrorLoggingService instance using injector
    // We use the injector because ErrorHandler is created before providers
    const errorLoggingService = this.injector.get(ErrorLoggingService);
    
    // Log the error
    errorLoggingService.logAngularError(error, {
      time: new Date().toISOString(),
      location: window.location.href,
      userAgent: navigator.userAgent
    });
    
    // Log to console as well for immediate visibility
    console.error('Global error handler caught an error:', error);
  }
}
