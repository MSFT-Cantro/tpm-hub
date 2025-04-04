import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { ErrorLoggingService, ErrorLog } from '../../services/error-logging.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss']
})
export class SettingsModalComponent implements OnInit {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  
  activeTab: 'settings' | 'logs' = 'settings';
  filteredLogs$: Observable<ErrorLog[]>;
  
  filters = {
    all: true,
    angular: true,
    javascript: true,
    federation: true,
    network: true,
    other: true
  };
  
  constructor(
    public themeService: ThemeService,
    private errorLoggingService: ErrorLoggingService
  ) {
    this.filteredLogs$ = this.errorLoggingService.getErrorLogs();
  }
  
  ngOnInit(): void {
    // Initialize with all logs
    this.updateFilters();
  }
  
  closeModal(): void {
    this.close.emit();
  }
  
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
  
  toggleDebug(): void {
    const debugUrl = '/debug';
    window.location.href = debugUrl;
  }
  
  setActiveTab(tab: 'settings' | 'logs'): void {
    this.activeTab = tab;
  }
  
  toggleAllFilters(): void {
    this.filters.all = !this.filters.all;
    
    // Set all filters to match the "All" checkbox state
    this.filters.angular = this.filters.all;
    this.filters.javascript = this.filters.all;
    this.filters.federation = this.filters.all;
    this.filters.network = this.filters.all;
    this.filters.other = this.filters.all;
    
    this.updateFilters();
  }
  
  updateFilters(): void {
    // If all individual filters are checked/unchecked, update the "All" checkbox
    const allSelected = 
      this.filters.angular && 
      this.filters.javascript && 
      this.filters.federation && 
      this.filters.network && 
      this.filters.other;
      
    const noneSelected = 
      !this.filters.angular && 
      !this.filters.javascript && 
      !this.filters.federation && 
      !this.filters.network && 
      !this.filters.other;
    
    this.filters.all = allSelected;
    
    // If no filters are selected, show all logs (to avoid empty state)
    if (noneSelected) {
      this.filters.all = true;
      this.filters.angular = true;
      this.filters.javascript = true;
      this.filters.federation = true;
      this.filters.network = true;
      this.filters.other = true;
    }
    
    // Update the filtered logs based on current filter settings
    this.filteredLogs$ = this.errorLoggingService.getErrorLogs();
    // Note: In a real implementation, you would filter based on the selected types
    // We're keeping it simple for now by showing all logs
  }
  
  clearErrorLogs(): void {
    if (confirm('Are you sure you want to clear all error logs? This cannot be undone.')) {
      this.errorLoggingService.clearLogs();
    }
  }
  
  downloadErrorLogs(): void {
    this.errorLoggingService.downloadLogs();
  }
  
  generateTestLog(): void {
    // Generate a different type of test log each time
    const types = ['angular', 'javascript', 'federation', 'network', 'other'];
    const randomType = types[Math.floor(Math.random() * types.length)] as any;
    
    switch (randomType) {
      case 'angular':
        const angularError = new Error('Test Angular Error');
        angularError.stack = 'Error: Test Angular Error\n    at SettingsModalComponent.generateTestLog (settings-modal.component.ts:123)\n    at SettingsModalComponent.testClick (settings-modal.component.ts:456)';
        this.errorLoggingService.logAngularError(angularError, { component: 'SettingsModalComponent', action: 'Test' });
        break;
        
      case 'javascript':
        const jsError = {
          message: 'Test JavaScript Error',
          filename: 'app.js',
          lineno: 42,
          colno: 13,
          error: { stack: 'Error: Test JavaScript Error\n    at runScript (app.js:42:13)' }
        } as ErrorEvent;
        this.errorLoggingService.logJavaScriptError(jsError, { browser: navigator.userAgent });
        break;
        
      case 'federation':
        this.errorLoggingService.logFederationError('Failed to load remote module: Test Federation Error', {
          remoteEntry: 'http://localhost:4203/remoteEntry.js',
          remoteName: 'test_remote',
          exposedModule: './TestModule'
        });
        break;
        
      case 'network':
        const networkError = {
          message: 'Test Network Error',
          status: 404,
          statusText: 'Not Found',
          url: 'http://localhost:4200/api/test'
        };
        this.errorLoggingService.logNetworkError(networkError, { requestType: 'GET' });
        break;
        
      default:
        this.errorLoggingService.logError('Test Other Error', 'other', { custom: 'data' });
        break;
    }
    
    alert('Test log generated successfully!');
  }
}
