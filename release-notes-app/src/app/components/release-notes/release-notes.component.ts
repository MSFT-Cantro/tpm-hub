import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AzureDevOpsService } from '../../services/azure-devops.service';
import { ReleaseNotesService } from '../../services/release-notes.service';
import { AzureWorkItem, DeploymentReadinessConfig } from '../../models/azure-work-item.model';

@Component({
  selector: 'app-release-notes',
  templateUrl: './release-notes.component.html',
  styleUrls: ['./release-notes.component.scss']
})
export class ReleaseNotesComponent implements OnInit {
  releaseForm: FormGroup;
  workItems: AzureWorkItem[] = [];
  resultText = '';
  isLoading = false;
  error: string | null = null;
  statusMessage = 'System Ready';
  
  dataCenters = {
    'US-East (LIVE)': true,
    'US-West (UW2P)': true,
    'EU-West (EUON)': true
  };

  constructor(
    private fb: FormBuilder,
    private azureDevOpsService: AzureDevOpsService,
    private releaseNotesService: ReleaseNotesService
  ) {
    this.releaseForm = this.fb.group({
      accessToken: ['', Validators.required],
      queryId: ['', Validators.required],
      filterType: ['CommunitySift/Morpheus'],
      releaseEngineer: [''],
      releaseVersion: [''],
      messagingPlatform: ['Teams']
    });
  }

  ngOnInit(): void {
    // Initialize access token from local storage if available
    const savedToken = localStorage.getItem('azureAccessToken');
    if (savedToken) {
      this.releaseForm.get('accessToken')?.setValue(savedToken);
    }
  }

  onFilterTypeChange(): void {
    // Show or hide Pottymouth-specific options based on selection
    const filterType = this.releaseForm.get('filterType')?.value;
    if (filterType === 'Pottymouth') {
      this.releaseForm.get('releaseEngineer')?.enable();
      this.releaseForm.get('releaseVersion')?.enable();
    } else {
      this.releaseForm.get('releaseEngineer')?.disable();
      this.releaseForm.get('releaseVersion')?.disable();
    }
  }

  toggleDataCenter(center: string): void {
    if (center === 'US-East (LIVE)' || center === 'US-West (UW2P)' || center === 'EU-West (EUON)') {
      this.dataCenters[center] = !this.dataCenters[center];
    }
  }

  getDataCenterStatus(center: string): boolean {
    if (center === 'US-East (LIVE)' || center === 'US-West (UW2P)' || center === 'EU-West (EUON)') {
      return this.dataCenters[center];
    }
    return false;
  }

  getDataCenterIcon(center: string): string {
    switch (center) {
      case 'US-East (LIVE)':
        return '🌎';
      case 'US-West (UW2P)':
        return '🌄';
      case 'EU-West (EUON)':
        return '🏰';
      default:
        return '🌐';
    }
  }
  
  getSafeId(text: string): string {
    // Replace any non-alphanumeric character with empty string
    return text.replace(/[^a-zA-Z0-9]/g, '');
  }

  fetchQuery(): void {
    if (this.releaseForm.invalid) {
      this.error = 'Please complete all required fields';
      return;
    }

    this.isLoading = true;
    this.statusMessage = 'Retrieving data...';
    this.error = null;
    
    // Save token to local storage for convenience
    localStorage.setItem('azureAccessToken', this.releaseForm.get('accessToken')?.value);
    
    const queryId = this.releaseForm.get('queryId')?.value;
    
    this.azureDevOpsService.getWorkItemsByQuery(queryId)
      .subscribe({
        next: (workItems) => {
          this.workItems = workItems;
          this.formatReleaseNotes();
          this.statusMessage = 'Intelligence retrieved successfully';
          this.isLoading = false;
        },
        error: (err) => {
          this.error = `Error: ${err.message || 'Failed to retrieve data'}`;
          this.statusMessage = 'Error: Operation failed';
          this.isLoading = false;
        }
      });
  }

  formatReleaseNotes(): void {
    if (!this.workItems.length) {
      this.resultText = 'No results found.';
      return;
    }
    
    const config: DeploymentReadinessConfig = {
      filterType: this.releaseForm.get('filterType')?.value,
      dataCenters: this.dataCenters,
      releaseEngineer: this.releaseForm.get('releaseEngineer')?.value,
      releaseVersion: this.releaseForm.get('releaseVersion')?.value,
      messagingPlatform: this.releaseForm.get('messagingPlatform')?.value
    };
    
    const queryUrl = this.releaseForm.get('queryId')?.value;
    
    this.resultText = this.releaseNotesService.formatDeploymentReadiness(
      queryUrl,
      this.workItems,
      config
    );
  }

  sendMessage(): void {
    if (!this.resultText) {
      this.error = 'No content to send. Please retrieve intelligence first.';
      return;
    }
    
    this.isLoading = true;
    const platform = this.releaseForm.get('messagingPlatform')?.value;
    this.statusMessage = `Transmitting to ${platform}...`;
    
    if (platform === 'Teams') {
      this.releaseNotesService.sendTeamsMessage(this.resultText)
        .subscribe(this.handleMessageResponse.bind(this));
    } else {
      this.releaseNotesService.sendSlackMessage(this.resultText)
        .subscribe(this.handleMessageResponse.bind(this));
    }
  }
  
  private handleMessageResponse(response: any): void {
    if (response.success) {
      this.statusMessage = 'Message transmitted successfully';
      this.error = null;
    } else {
      this.error = `Failed to send message: ${response.message || 'Unknown error'}`;
      this.statusMessage = 'Transmission failed';
    }
    this.isLoading = false;
  }
}