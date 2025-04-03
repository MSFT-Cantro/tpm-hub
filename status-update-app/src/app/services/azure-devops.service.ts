import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AzureWorkItem, AzureQueryResult } from '../models/azure-work-item.model';

@Injectable({
  providedIn: 'root'
})
export class AzureDevOpsService {
  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    // Base64 encode the PAT with empty username
    const pat = environment.azureDevOps.pat;
    
    // If PAT is the placeholder value, provide a more helpful error
    if (pat === 'your-personal-access-token') {
      console.error('Please replace the PAT placeholder with your actual Personal Access Token in environment.ts');
    }
    
    const base64Pat = btoa(`:${pat}`);
    
    return new HttpHeaders({
      'Authorization': `Basic ${base64Pat}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private convertOrgUrl(url: string): string {
    if (!url.endsWith('/')) {
      return url + '/';
    }
    return url;
  }

  private extractQueryId(queryInput: string): string {
    // Handle full URL with query ID
    if (queryInput.includes('_queries/query/')) {
      const parts = queryInput.split('_queries/query/');
      if (parts.length > 1) {
        // Extract just the GUID part
        return parts[1].split('/')[0];
      }
    }
    
    // Handle URL with id= parameter
    if (queryInput.includes('id=')) {
      return queryInput.split('id=').pop()?.split('&')[0] || queryInput;
    }
    
    // Assume it's already a query ID
    return queryInput;
  }

  /**
   * Queries Azure DevOps for work items by query ID
   */
  getWorkItemsByQuery(queryInput: string): Observable<AzureWorkItem[]> {
    const orgUrl = this.convertOrgUrl(environment.azureDevOps.orgUrl);
    const project = environment.azureDevOps.project;
    const queryId = this.extractQueryId(queryInput);
    
    console.log('Using query ID:', queryId);
    
    if (!orgUrl || !project || !queryId) {
      return throwError(() => new Error('Missing required Azure DevOps configuration'));
    }
    
    if (environment.azureDevOps.pat === 'your-personal-access-token') {
      return throwError(() => new Error('Please set your Personal Access Token (PAT) in the environment.ts file'));
    }

    const url = `${orgUrl}${project}/_apis/wit/wiql/${queryId}?api-version=6.0`;
    console.log('Requesting URL:', url);
    
    return this.http.get<any>(url, { headers: this.getAuthHeaders() })
      .pipe(
        switchMap(response => {
          console.log('Query response:', response);
          
          if (!response.workItems || response.workItems.length === 0) {
            return of([]);
          }
          
          // Get IDs from query results
          const ids = response.workItems.map((wi: any) => wi.id).join(',');
          
          // Fetch full work item details
          return this.getWorkItemsDetails(ids);
        }),
        catchError(this.handleError)
      );
  }
  
  /**
   * Error handler for HTTP requests
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Azure DevOps API Error:', error);
    
    let errorMsg = 'Unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMsg = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 203 || error.status === 302) {
        errorMsg = 'Authentication failed. Please check your Personal Access Token (PAT).';
      } else if (error.status === 401 || error.status === 403) {
        errorMsg = 'Unauthorized access. Please verify your Personal Access Token has proper permissions.';
      } else if (error.status === 404) {
        errorMsg = 'Resource not found. Please verify your organization URL, project name, and query ID.';
      } else {
        errorMsg = `Server Error: ${error.status}, ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMsg));
  }

  /**
   * Fetches detailed work item information by IDs
   */
  private getWorkItemsDetails(ids: string): Observable<AzureWorkItem[]> {
    const orgUrl = this.convertOrgUrl(environment.azureDevOps.orgUrl);
    const fields = [
      'System.Id',
      'System.Title',
      'System.State',
      'System.Tags',
      'System.AssignedTo',
      'System.History',
      'System.Description'
    ].join(',');
    
    const url = `${orgUrl}_apis/wit/workitems?ids=${ids}&fields=${fields}&api-version=6.0`;
    
    return this.http.get<any>(url, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => {
          if (!response.value || response.value.length === 0) {
            return [];
          }
          
          // Process and return the work items
          return response.value.map((item: any) => {
            // Add the history as a custom field for parsing
            if (item.fields['System.History']) {
              item.fields['Custom.Discussion'] = [{ text: item.fields['System.History'] }];
            } else {
              item.fields['Custom.Discussion'] = [];
            }
            
            return {
              id: item.id,
              fields: item.fields
            };
          });
        }),
        catchError(this.handleError)
      );
  }
}