import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AzureWorkItem } from '../models/azure-work-item.model';

@Injectable({
  providedIn: 'root'
})
export class AzureDevOpsService {
  private baseUrl = 'https://dev.azure.com';
  private apiVersion = '7.0';

  constructor(private http: HttpClient) { }

  getWorkItemsByQuery(queryIdOrUrl: string): Observable<AzureWorkItem[]> {
    // Extract organization and project from query URL if full URL is provided
    let organization: string;
    let project: string;
    let queryId: string;

    if (queryIdOrUrl.includes('dev.azure.com')) {
      const urlParts = queryIdOrUrl.split('/');
      const orgIndex = urlParts.indexOf('dev.azure.com') + 1;
      organization = urlParts[orgIndex];
      project = urlParts[orgIndex + 1];
      queryId = urlParts[urlParts.length - 1];
    } else {
      organization = environment.azure.organization;
      project = environment.azure.project;
      queryId = queryIdOrUrl;
    }

    const url = `${this.baseUrl}/${organization}/${project}/_apis/wit/wiql/${queryId}?api-version=${this.apiVersion}`;
    
    return this.http.get<any>(url, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.workItems?.length > 0) {
          return this.getWorkItems(organization, project, response.workItems.map((wi: any) => wi.id));
        }
        return [];
      }),
      switchMap(result => Array.isArray(result) ? [result] : result),
      catchError(error => throwError(() => new Error(`Failed to fetch work items: ${error.message}`)))
    );
  }

  private getWorkItems(organization: string, project: string, ids: number[]): Observable<AzureWorkItem[]> {
    if (!ids.length) return new Observable<AzureWorkItem[]>(subscriber => {
      subscriber.next([]);
      subscriber.complete();
    });

    const url = `${this.baseUrl}/${organization}/${project}/_apis/wit/workitems?ids=${ids.join(',')}&api-version=${this.apiVersion}`;
    
    return this.http.get<any>(url, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.value) {
          return response.value.map((item: any) => ({
            id: item.id,
            fields: item.fields,
            url: item.url
          }));
        }
        return [];
      }),
      catchError(error => throwError(() => new Error(`Failed to fetch work item details: ${error.message}`)))
    );
  }

  private getHeaders(): HttpHeaders {
    if (!environment.azure?.pat) {
      throw new Error('Azure DevOps Personal Access Token not configured');
    }

    const token = btoa(`:${environment.azure.pat}`);
    return new HttpHeaders({
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json'
    });
  }
}