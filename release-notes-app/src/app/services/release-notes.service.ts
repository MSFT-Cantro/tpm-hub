import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AzureWorkItem, DeploymentReadinessConfig } from '../models/azure-work-item.model';

@Injectable({
  providedIn: 'root'
})
export class ReleaseNotesService {
  constructor(private http: HttpClient) { }

  /**
   * Format the work items for deployment readiness based on the selected template
   */
  formatDeploymentReadiness(
    queryUrl: string, 
    workItems: AzureWorkItem[], 
    config: DeploymentReadinessConfig
  ): string {
    if (config.filterType === 'CommunitySift/Morpheus') {
      return this.formatCommunitySiftMorpheus(queryUrl, workItems);
    } else {
      return this.formatPottymouth(queryUrl, workItems, config);
    }
  }

  /**
   * Format for CommunitySift/Morpheus option
   */
  private formatCommunitySiftMorpheus(queryUrl: string, workItems: AzureWorkItem[]): string {
    const output: string[] = [];
    
    // Header
    output.push("Hi everyone.\n");
    output.push("Scope of Release:");
    output.push(`${queryUrl}\n`);

    // Customer Highlights
    output.push("Customer Highlights:");
    output.push("Change/Improvement Clients will notice:");
    
    const customerHighlights = workItems
      .filter(item => {
        const tags = item.fields['System.Tags'] || '';
        return tags.split('; ').some(tag => tag.toLowerCase() === 'customer highlight');
      })
      .map(item => `- ${item.fields['System.Title']} (ID: ${item.id})`);
      
    output.push(customerHighlights.length ? customerHighlights.join('\n') : "None");
    output.push("");

    // High Risk Items
    output.push("Release - High Risk Items:");
    output.push(...this.formatRiskSections(queryUrl, workItems, "risk: high", "High"));

    // Medium Risk Items
    output.push("Release - Medium Risk Items:");
    output.push(...this.formatRiskSections(queryUrl, workItems, "risk: medium", "Medium"));

    // Footer
    output.push("cc: Ashley Hill, Alyx McMillan, Robert Smith, Kelly Medeiros, Jeremy AAsum");
    
    return output.join('\n');
  }
  
  /**
   * Format for Pottymouth option
   */
  private formatPottymouth(
    queryUrl: string, 
    workItems: AzureWorkItem[], 
    config: DeploymentReadinessConfig
  ): string {
    const output: string[] = [];
    
    // Calculate next Wednesday's date
    const today = new Date();
    let daysUntilWed = (9 - today.getDay()) % 7;
    if (daysUntilWed === 0) {
      daysUntilWed = 7;
    }
    const nextWed = new Date(today);
    nextWed.setDate(today.getDate() + daysUntilWed);
    const wedDate = nextWed.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    
    // Get version info
    const version = config.releaseVersion || "Unknown";
    
    // Header
    output.push(`Hi everyone!  The release for next week is happening on ${wedDate}, between 8 and 10PM PST.`);
    output.push(`Outage notifications for ${wedDate}.`);
    output.push(`Scope of the release ADO: Community Sift Pottymouth Release v${version}`);
    output.push(`Deployment Date – ${wedDate}, Window - 8PM - 10:00PM PST`);
    
    // Build DC info
    if (config.dataCenters) {
      const selectedDcs = Object.entries(config.dataCenters)
        .filter(([_, isSelected]) => isSelected)
        .map(([dcName]) => dcName);
      
      const totalDcs = Object.keys(config.dataCenters).length;
      
      if (selectedDcs.length === totalDcs) {
        output.push("Deployment DCs- All DCs impacted");
      } else {
        output.push(`Deployment DCs- ${selectedDcs.length} of ${totalDcs} DCs impacted`);
      }
      
      // Add selected data centers
      if (selectedDcs.length) {
        selectedDcs.forEach(dc => output.push(dc));
      } else {
        output.push("No DCs selected");
      }
    } else {
      output.push("Deployment DCs- All DCs impacted");
    }
    
    // Add Release Engineer
    const engineer = config.releaseEngineer || "TBD";
    output.push(`Release Engineer: ${engineer}`);
    output.push("");
    
    // Customer Highlights
    output.push("Customer Highlights:");
    output.push("Change/Improvement Clients will notice:");
    
    const customerHighlights = workItems
      .filter(item => {
        const tags = item.fields['System.Tags'] || '';
        return tags.split('; ').some(tag => tag.toLowerCase() === 'customer highlight');
      })
      .map(item => `- ${item.fields['System.Title']} (ID: ${item.id})`);
      
    output.push(customerHighlights.length ? customerHighlights.join('\n') : "None");
    output.push("");

    // High Risk Items
    output.push("Release - High Risk Items:");
    output.push(...this.formatRiskSections(
      queryUrl, 
      workItems, 
      "risk: high", 
      "High",
      engineer,
      config.dataCenters ? Object.entries(config.dataCenters)
        .filter(([_, isSelected]) => isSelected)
        .map(([dcName]) => dcName) : [],
      wedDate
    ));

    // Medium Risk Items
    output.push("Release - Medium Risk Items:");
    output.push(...this.formatRiskSections(
      queryUrl, 
      workItems, 
      "risk: medium", 
      "Medium",
      engineer,
      config.dataCenters ? Object.entries(config.dataCenters)
        .filter(([_, isSelected]) => isSelected)
        .map(([dcName]) => dcName) : [],
      wedDate
    ));

    // Footer
    output.push("cc: Alyx McMillan, Ashley Hill, Robert Smith, Kelly Medeiros, Carrie Blondahl, Jeremy AAsum (HE/HIM)");
    
    return output.join('\n');
  }

  /**
   * Format an individual risk item
   */
  private formatRiskItem(
    item: AzureWorkItem, 
    itemUrl: string, 
    riskLevel: string,
    engineer?: string,
    selectedDcs?: string[],
    releaseDate?: string
  ): string[] {
    const output: string[] = [];
    
    // Format the item header with ID and title
    output.push(`### ${itemUrl} - ${item.fields['System.Title']}`);
    output.push(`State: ${item.fields['System.State'] || 'Unknown'}`);
    
    // Release information
    if (engineer) {
      output.push(`Release Engineer: ${engineer}`);
    } else {
      const assignedTo = item.fields['System.AssignedTo']?.displayName || 'Not assigned';
      output.push(`Release Engineer: ${assignedTo}`);
    }
    
    // Data Centers information
    if (selectedDcs && selectedDcs.length) {
      output.push(`Data Centers involved: ${selectedDcs.join(', ')}`);
    } else {
      output.push("Data Centers involved: All");
    }
    
    // Fields that should return blank as requested
    output.push("Scheduled Release Time:");
    output.push("Impact Level:");
    
    // Risk details
    output.push(`Risk Assessment: ${riskLevel}`);
    
    // Customer Impact section (blank as requested)
    output.push("Customer Impact:");
    
    // Mitigation and Rollback (blank as requested)
    output.push("Risk Mitigation Plan:");
    output.push("Rollback Plan:");
    
    output.push("");  // Add blank line for spacing
    return output;
  }

  /**
   * Format risk sections
   */
  private formatRiskSections(
    queryUrl: string, 
    workItems: AzureWorkItem[], 
    riskTag: string, 
    riskLevel: string,
    engineer?: string,
    selectedDcs?: string[],
    releaseDate?: string
  ): string[] {
    const output: string[] = [];
    
    // Filter items by tag
    const riskItems = workItems.filter(item => {
      const tags = item.fields['System.Tags'] || '';
      return tags.split('; ').some(tag => tag.toLowerCase() === riskTag.toLowerCase());
    });
    
    if (riskItems.length) {
      for (const item of riskItems) {
        const itemUrl = `${queryUrl.split('_queries')[0]}_workitems/edit/${item.id}`;
        output.push(...this.formatRiskItem(
          item, 
          itemUrl, 
          riskLevel,
          engineer,
          selectedDcs,
          releaseDate
        ));
      }
    } else {
      output.push("None");
      output.push("");
    }
    
    return output;
  }

  /**
   * Send message to Teams
   */
  sendTeamsMessage(message: string): Observable<any> {
    if (!environment.teams || !environment.teams.clientId || 
        !environment.teams.clientSecret || !environment.teams.tenantId || !environment.teams.chatId) {
      return throwError(() => new Error('Teams API not configured. Please check your environment configuration.'));
    }
    
    const url = '/api/teams-message'; // This would be a proxy endpoint in your server
    
    return this.http.post(url, { message }, { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  /**
   * Send message to Slack
   */
  sendSlackMessage(message: string): Observable<any> {
    if (!environment.slack || !environment.slack.botToken || !environment.slack.channelId) {
      return throwError(() => new Error('Slack API not configured. Please check your environment configuration.'));
    }
    
    const url = '/api/slack-message'; // This would be a proxy endpoint in your server
    
    return this.http.post(url, { message }, { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }
}