import { Component, OnInit } from '@angular/core';
import { ErrorLoggingService, ErrorLog } from '../../services/error-logging.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-logs',
  template: `
    <div class="logs-container">
      <div class="logs-header">
        <h1>Application Logs</h1>
        <p class="logs-description">View and manage all application error logs, including federation issues, Angular errors, and more.</p>
      </div>
      
      <div class="logs-toolbar">
        <div class="logs-filters">
          <span class="filter-label">Filter by type:</span>
          <div class="filter-options">
            <label>
              <input type="checkbox" [checked]="showAllTypes" (change)="toggleAllTypes()"/>
              All
            </label>
            <label>
              <input type="checkbox" [(ngModel)]="filters.angular" (change)="updateFilters()"/>
              Angular
            </label>
            <label>
              <input type="checkbox" [(ngModel)]="filters.javascript" (change)="updateFilters()"/>
              JavaScript
            </label>
            <label>
              <input type="checkbox" [(ngModel)]="filters.federation" (change)="updateFilters()"/>
              Federation
            </label>
            <label>
              <input type="checkbox" [(ngModel)]="filters.network" (change)="updateFilters()"/>
              Network
            </label>
            <label>
              <input type="checkbox" [(ngModel)]="filters.other" (change)="updateFilters()"/>
              Other
            </label>
          </div>
        </div>
        
        <div class="logs-actions">
          <button (click)="clearLogs()" class="clear-btn" title="Clear all logs">
            <span class="btn-icon">🗑️</span> Clear Logs
          </button>
          <button (click)="downloadLogs()" class="download-btn" title="Download logs as JSON file">
            <span class="btn-icon">💾</span> Download Logs
          </button>
          <button (click)="generateTestLog()" class="test-btn" title="Generate a test log entry">
            <span class="btn-icon">🧪</span> Test Log
          </button>
        </div>
      </div>
      
      <div *ngIf="(filteredLogs$ | async)?.length === 0" class="no-logs">
        <div class="no-logs-content">
          <span class="no-logs-icon">📋</span>
          <p>No logs available</p>
          <button (click)="generateTestLog()" class="generate-btn">Generate Test Log</button>
        </div>
      </div>
      
      <div class="logs-list">
        <div *ngFor="let log of filteredLogs$ | async" class="log-item" [ngClass]="'log-type-' + log.type">
          <div class="log-header">
            <div class="log-type">{{ log.type | titlecase }}</div>
            <div class="log-timestamp">{{ log.timestamp | date:'medium' }}</div>
          </div>
          <div class="log-message">{{ log.message }}</div>
          
          <div *ngIf="log.source" class="log-source">
            <span class="source-label">Source:</span> {{ log.source }}
            <span *ngIf="log.lineNumber" class="source-detail">Line: {{ log.lineNumber }}</span>
            <span *ngIf="log.columnNumber" class="source-detail">Column: {{ log.columnNumber }}</span>
          </div>
          
          <details *ngIf="log.stackTrace" class="log-details">
            <summary>Stack Trace</summary>
            <pre class="log-stacktrace">{{ log.stackTrace }}</pre>
          </details>
          
          <details *ngIf="log.additionalInfo" class="log-details">
            <summary>Additional Info</summary>
            <pre class="log-additional-info">{{ log.additionalInfo | json }}</pre>
          </details>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .logs-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      color: var(--text-primary, #333);
      font-family: var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
    }
    
    .logs-header {
      margin-bottom: 24px;
    }
    
    .logs-header h1 {
      margin: 0 0 10px 0;
      color: var(--accent-primary, #2196f3);
    }
    
    .logs-description {
      color: var(--text-secondary, #666);
      margin: 0;
    }
    
    .logs-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 15px;
      background: var(--bg-secondary, #f5f5f5);
      padding: 15px;
      border-radius: 8px;
    }
    
    .logs-filters {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .filter-label {
      font-weight: 500;
      margin-right: 10px;
    }
    
    .filter-options {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }
    
    .filter-options label {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
    }
    
    .logs-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    button {
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all 0.2s ease;
    }
    
    .clear-btn {
      background-color: var(--danger, #f44336);
      color: white;
    }
    
    .download-btn {
      background-color: var(--info, #2196f3);
      color: white;
    }
    
    .test-btn, .generate-btn {
      background-color: var(--warning, #ff9800);
      color: white;
    }
    
    button:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }
    
    .btn-icon {
      margin-right: 5px;
      font-size: 16px;
    }
    
    .no-logs {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-secondary, #666);
      background: var(--bg-secondary, #f5f5f5);
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .no-logs-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
    
    .no-logs-icon {
      font-size: 48px;
      opacity: 0.6;
    }
    
    .logs-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 30px;
    }
    
    .log-item {
      padding: 15px;
      background: var(--bg-secondary, #f5f5f5);
      border-radius: 6px;
      border-left: 5px solid #ccc;
    }
    
    .log-type-angular { border-left-color: #dd0031; }
    .log-type-javascript { border-left-color: #f7df1e; }
    .log-type-federation { border-left-color: #7b1fa2; }
    .log-type-network { border-left-color: #0288d1; }
    .log-type-other { border-left-color: #607d8b; }
    
    .log-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    
    .log-type {
      font-weight: bold;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      color: white;
      background-color: #607d8b;
    }
    
    .log-type-angular .log-type { background-color: #dd0031; }
    .log-type-javascript .log-type { background-color: #f7df1e; color: #333; }
    .log-type-federation .log-type { background-color: #7b1fa2; }
    .log-type-network .log-type { background-color: #0288d1; }
    .log-type-other .log-type { background-color: #607d8b; }
    
    .log-timestamp {
      font-size: 0.85rem;
      color: var(--text-secondary, #666);
    }
    
    .log-message {
      margin-bottom: 10px;
      font-weight: 500;
      line-height: 1.5;
      word-break: break-word;
    }
    
    .log-source {
      font-size: 0.9rem;
      color: var(--text-secondary, #666);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .source-label {
      font-weight: 500;
    }
    
    .source-detail {
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(0,0,0,0.05);
      font-size: 0.8rem;
    }
    
    .log-details {
      margin-top: 10px;
    }
    
    .log-details summary {
      cursor: pointer;
      color: var(--accent-primary, #2196f3);
      font-size: 0.9rem;
      user-select: none;
    }
    
    .log-details summary:hover {
      text-decoration: underline;
    }
    
    .log-stacktrace,
    .log-additional-info {
      background: var(--bg-tertiary, #e0e0e0);
      padding: 10px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.85rem;
      overflow-x: auto;
      white-space: pre-wrap;
      margin-top: 10px;
    }
  `]
})
export class LogsComponent implements OnInit {
  filteredLogs$: Observable<ErrorLog[]>;
  showAllTypes = true;
  
  filters = {
    angular: true,
    javascript: true,
    federation: true,
    network: true,
    other: true
  };
  
  constructor(private errorLoggingService: ErrorLoggingService) {
    this.filteredLogs$ = this.errorLoggingService.getErrorLogs();
  }
  
  ngOnInit(): void {
    // Initialize with all logs
    this.updateFilters();
  }
  
  toggleAllTypes(): void {
    this.showAllTypes = !this.showAllTypes;
    
    // Set all filters to match the "All" checkbox state
    if (this.showAllTypes) {
      this.filters = {
        angular: true,
        javascript: true,
        federation: true,
        network: true,
        other: true
      };
    } else {
      this.filters = {
        angular: false,
        javascript: false,
        federation: false,
        network: false,
        other: false
      };
    }
    
    this.updateFilters();
  }
  
  updateFilters(): void {
    // If all individual filters are checked/unchecked, update the "All" checkbox
    const allSelected = Object.values(this.filters).every(val => val === true);
    const noneSelected = Object.values(this.filters).every(val => val === false);
    
    this.showAllTypes = allSelected;
    
    // If no filters are selected, show all logs (to avoid empty state)
    if (noneSelected) {
      this.showAllTypes = true;
      Object.keys(this.filters).forEach(key => {
        this.filters[key as keyof typeof this.filters] = true;
      });
    }
    
    // Update the filtered logs based on current filter settings
    this.filteredLogs$ = this.errorLoggingService.getErrorLogs();
  }
  
  clearLogs(): void {
    if (confirm('Are you sure you want to clear all logs? This cannot be undone.')) {
      this.errorLoggingService.clearLogs();
    }
  }
  
  downloadLogs(): void {
    this.errorLoggingService.downloadLogs();
  }
  
  generateTestLog(): void {
    // Generate a different type of test log each time
    const types = ['angular', 'javascript', 'federation', 'network', 'other'];
    const randomType = types[Math.floor(Math.random() * types.length)] as 'angular' | 'javascript' | 'federation' | 'network' | 'other';
    
    switch (randomType) {
      case 'angular':
        const angularError = new Error('Test Angular Error');
        angularError.stack = 'Error: Test Angular Error\n    at LogsComponent.generateTestLog (logs.component.ts:123)\n    at LogsComponent.testClick (logs.component.ts:456)';
        this.errorLoggingService.logAngularError(angularError, { component: 'LogsComponent', action: 'Test' });
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