import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorLoggingService, ErrorLog } from '../../services/error-logging.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error-logs',
  templateUrl: './error-logs.component.html',
  styleUrls: ['./error-logs.component.scss']
})
export class ErrorLogsComponent implements OnInit, OnDestroy {
  errorLogs: ErrorLog[] = [];
  filteredLogs: ErrorLog[] = [];
  selectedLog: ErrorLog | null = null;
  filterType: string = 'all';
  searchQuery: string = '';
  
  private subscription: Subscription = new Subscription();
  
  constructor(private errorLoggingService: ErrorLoggingService) { }

  ngOnInit(): void {
    // Subscribe to error logs updates
    this.subscription.add(
      this.errorLoggingService.getErrorLogs().subscribe(logs => {
        this.errorLogs = logs;
        this.applyFilters();
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  /**
   * Apply filters based on type and search query
   */
  applyFilters(): void {
    let filtered = [...this.errorLogs];
    
    // Filter by type
    if (this.filterType !== 'all') {
      filtered = filtered.filter(log => log.type === this.filterType);
    }
    
    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(query) || 
        (log.stackTrace && log.stackTrace.toLowerCase().includes(query)) ||
        (log.source && log.source.toLowerCase().includes(query))
      );
    }
    
    this.filteredLogs = filtered;
  }
  
  /**
   * Set the type filter
   */
  setFilter(type: string): void {
    this.filterType = type;
    this.applyFilters();
  }
  
  /**
   * Handle search input change
   */
  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }
  
  /**
   * Select a log to view details
   */
  selectLog(log: ErrorLog): void {
    this.selectedLog = log;
  }
  
  /**
   * Clear all logs
   */
  clearLogs(): void {
    if (confirm('Are you sure you want to clear all error logs?')) {
      this.errorLoggingService.clearLogs();
      this.selectedLog = null;
    }
  }
  
  /**
   * Download logs as a file
   */
  downloadLogs(): void {
    this.errorLoggingService.downloadLogs();
  }
  
  /**
   * Format the log timestamp for display
   */
  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
  }
  
  /**
   * Get the severity class for a log type
   */
  getLogClass(type: string): string {
    switch (type) {
      case 'federation': return 'federation-error';
      case 'angular': return 'angular-error';
      case 'javascript': return 'javascript-error';
      case 'network': return 'network-error';
      default: return 'other-error';
    }
  }
}
