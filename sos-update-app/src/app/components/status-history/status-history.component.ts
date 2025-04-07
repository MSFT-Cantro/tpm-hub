import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StatusService } from '../../services/status.service';
import { Status } from '../../models/status.model';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-status-history',
  templateUrl: './status-history.component.html',
  styleUrls: ['./status-history.component.scss']
})
export class StatusHistoryComponent implements OnInit {
  @ViewChild(ModalComponent) statusFormModal!: ModalComponent;
  
  statusUpdates: Status[] = [];
  filteredStatusUpdates: Status[] = [];
  isStatusFormModalOpen = false;
  
  filters = {
    important: false,
    urgent: false,
    completed: false,
    inProgress: false
  };

  constructor(
    private statusService: StatusService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadStatusUpdates();
  }

  loadStatusUpdates() {
    this.statusService.getStatusUpdates().subscribe(updates => {
      this.statusUpdates = updates;
      this.applyFilters();
    });
  }

  applyFilters() {
    // If no filters are active, show all updates
    if (!Object.values(this.filters).some(value => value)) {
      this.filteredStatusUpdates = this.statusUpdates;
      return;
    }

    // Filter SoS updates based on selected options
    this.filteredStatusUpdates = this.statusUpdates.filter(status => {
      return (
        (!this.filters.important || status.options?.important) &&
        (!this.filters.urgent || status.options?.urgent) &&
        (!this.filters.completed || status.options?.completed) &&
        (!this.filters.inProgress || status.options?.inProgress)
      );
    });
  }

  deleteStatus(id: number) {
    this.statusService.deleteStatus(id).subscribe({
      next: () => {
        this.loadStatusUpdates();
      },
      error: (error: Error) => {
        console.error('Error deleting status:', error);
      }
    });
  }

  // Watch for changes in filters
  onFilterChange() {
    this.applyFilters();
  }

  // Modal management methods
  openStatusFormModal() {
    this.isStatusFormModalOpen = true;
  }

  onStatusFormModalClosed() {
    this.isStatusFormModalOpen = false;
  }

  onNewStatusSubmitted() {
    // Close the modal
    this.isStatusFormModalOpen = false;
    
    // Refresh the SoS updates list
    this.loadStatusUpdates();
  }
}
