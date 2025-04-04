import { Component, OnInit } from '@angular/core';
import { ErrorLoggingService, ErrorLog } from '../../services/error-logging.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-error-logs',
  template: `
    <div class="error-logs-container">
      <div class="error-logs-header">
        <h2>Error Logs</h2>
        <div class="error-logs-actions">
          <button (click)="clearLogs()" class="clear-btn">Clear Logs</button>
          <button (click)="downloadLogs()" class="download-btn">Download Logs</button>
        </div>
      </div>
      
      <div class="error-logs-filters">
        <span>Filter by type:</span>
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
      
      <div *ngIf="(filteredLogs$ | async)?.length === 0" class="no-logs">
        <p>No error logs to display</p>
      </div>
      
      <div class="error-logs-list">
        <div *ngFor="let log of filteredLogs$ | async" class="error-log-item" [ngClass]="'error-type-' + log.type">
          <div class="error-log-header">
            <div class="error-log-type">{{ log.type | titlecase }}</div>
            <div class="error-log-timestamp">{{ log.timestamp | date:'medium' }}</div>
          </div>
          <div class="error-log-message">{{ log.message }}</div>
          
          <div *ngIf="log.source" class="error-log-source">
            Source: {{ log.source }}
            <span *ngIf="log.lineNumber">Line: {{ log.lineNumber }}</span>
            <span *ngIf="log.columnNumber">Column: {{ log.columnNumber }}</span>
          </div>
          
          <details *ngIf="log.stackTrace" class="error-log-details">
            <summary>Stack Trace</summary>
            <pre class="error-log-stacktrace">{{ log.stackTrace }}</pre>
          </details>
          
          <details *ngIf="log.additionalInfo" class="error-log-details">
            <summary>Additional Info</summary>
            <pre class="error-log-additional-info">{{ log.additionalInfo | json }}</pre>
          </details>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-logs-container {
      background: var(--bg-secondary, #f5f5f5);
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .error-logs-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .error-logs-header h2 {
      margin: 0;
      color: var(--text-primary, #333);
    }
    
    .error-logs-actions {
      display: flex;
      gap: 10px;
    }
    
    .clear-btn, .download-btn {
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .clear-btn {
      background: var(--danger, #f44336);
      color: white;
    }
    
    .download-btn {
      background: var(--primary, #2196f3);
      color: white;
    }
    
    .error-logs-filters {
      margin-bottom: 20px;
      padding: 10px;
      background: var(--bg-tertiary, #e0e0e0);
      border-radius: 4px;
    }
    
    .filter-options {
      display: flex;
      gap: 15px;
      margin-top: 10px;
    }
    
    .filter-options label {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
    }
    
    .no-logs {
      text-align: center;
      padding: 20px;
      color: var(--text-secondary, #666);
      font-style: italic;
    }
    
    .error-logs-list {
      max-height: 400px;
      overflow-y: auto;
    }
    
    .error-log-item {
      margin-bottom: 15px;
      padding: 15px;
      border-radius: 4px;
      border-left: 5px solid #ccc;
    }
    
    .error-type-angular { border-left-color: #dd0031; }
    .error-type-javascript { border-left-color: #f7df1e; }
    .error-type-federation { border-left-color: #7b1fa2; }
    .error-type-network { border-left-color: #0288d1; }
    .error-type-other { border-left-color: #607d8b; }
    
    .error-log-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    
    .error-log-type {
      font-weight: bold;
      color: var(--text-primary, #333);
    }
    
    .error-log-timestamp {
      font-size: 0.8rem;
      color: var(--text-secondary, #666);
    }
    
    .error-log-message {
      margin-bottom: 10px;
      font-weight: medium;
      color: var(--text-primary, #333);
    }
    
    .error-log-source {
      font-size: 0.9rem;
      color: var(--text-secondary, #666);
      margin-bottom: 10px;
    }
    
    .error-log-details {
      margin-top: 10px;
    }
    
    .error-log-details summary {
      cursor: pointer;
      color: var(--text-secondary, #666);
      font-size: 0.9rem;
    }
    
    .error-log-stacktrace,
    .error-log-additional-info {
      background: var(--bg-tertiary, #e0e0e0);
      padding: 10px;
      border-radius: 4px;
      font-size: 0.85rem;
      overflow-x: auto;
      white-space: pre-wrap;
      margin-top: 10px;
    }
  `]
})
export class ErrorLogsComponent implements OnInit {
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
    this.errorLoggingService.clearLogs();
  }
  
  downloadLogs(): void {
    this.errorLoggingService.downloadLogs();
  }
}