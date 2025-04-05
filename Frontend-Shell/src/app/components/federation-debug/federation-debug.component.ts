import { Component, OnInit, OnDestroy } from '@angular/core';
import { FederationDebugService, FederationDebugInfo } from '../../services/federation-debug.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-federation-debug',
  templateUrl: './federation-debug.component.html',
  styleUrls: ['./federation-debug.component.scss']
})
export class FederationDebugComponent implements OnInit, OnDestroy {
  debugLogs: FederationDebugInfo[] = [];
  filteredLogs: FederationDebugInfo[] = [];
  selectedTypes: { [key: string]: boolean } = {
    info: true,
    warn: true,
    error: true
  };
  filterText: string = '';
  private subscription: Subscription | null = null;

  constructor(private federationDebugService: FederationDebugService) {}

  ngOnInit(): void {
    this.subscription = this.federationDebugService.getLogs().subscribe(logs => {
      this.debugLogs = logs;
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  refreshFederationCheck(): void {
    this.federationDebugService.checkFederationSetup();
  }

  clearLogs(): void {
    this.federationDebugService.clearLogs();
  }

  toggleType(type: string): void {
    this.selectedTypes[type] = !this.selectedTypes[type];
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredLogs = this.debugLogs.filter(log => {
      const typeMatch = this.selectedTypes[log.type];
      const textMatch = !this.filterText || 
        log.message.toLowerCase().includes(this.filterText.toLowerCase()) ||
        (log.details && JSON.stringify(log.details).toLowerCase().includes(this.filterText.toLowerCase()));
      
      return typeMatch && textMatch;
    });
  }

  // Helper function to determine the background color of the log entry
  getLogColor(log: FederationDebugInfo): string {
    switch(log.type) {
      case 'error': return 'rgba(244, 67, 54, 0.1)';
      case 'warn': return 'rgba(255, 152, 0, 0.1)';
      case 'info': return 'rgba(33, 150, 243, 0.1)';
      default: return 'transparent';
    }
  }

  // Helper function for truncating long messages
  truncate(text: string, length: number = 100): string {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  }
}