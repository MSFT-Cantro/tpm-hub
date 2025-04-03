import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Status, StatusOptions } from '../models/status.model';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private statusUpdates: Status[] = [];
  private statusSubject = new BehaviorSubject<Status[]>([]);
  private nextId = 1;

  constructor() {
    // Load any saved status updates from localStorage
    this.loadStatusUpdates();
  }

  getStatusUpdates(): Observable<Status[]> {
    return this.statusSubject.asObservable();
  }

  addStatus(message: string, author: string, additionalOptions?: StatusOptions): Status {
    const newStatus: Status = {
      id: this.nextId++,
      message,
      author,
      timestamp: new Date(),
      options: additionalOptions?.options || {
        important: false,
        urgent: false,
        completed: false,
        inProgress: false
      },
      visibility: additionalOptions?.visibility || 'public'
    };

    this.statusUpdates.unshift(newStatus);
    this.statusSubject.next([...this.statusUpdates]);
    this.saveStatusUpdates();
    
    return newStatus;
  }

  deleteStatus(id: number): Observable<void> {
    this.statusUpdates = this.statusUpdates.filter(status => status.id !== id);
    this.statusSubject.next([...this.statusUpdates]);
    this.saveStatusUpdates();
    return of(void 0);
  }

  updateStatus(updatedStatus: Status): void {
    const index = this.statusUpdates.findIndex(s => s.id === updatedStatus.id);
    if (index !== -1) {
      this.statusUpdates[index] = { ...updatedStatus };
      this.statusSubject.next([...this.statusUpdates]);
      this.saveStatusUpdates();
    }
  }

  private saveStatusUpdates(): void {
    localStorage.setItem('statusUpdates', JSON.stringify(this.statusUpdates));
  }

  private loadStatusUpdates(): void {
    const savedUpdates = localStorage.getItem('statusUpdates');
    if (savedUpdates) {
      const parsed = JSON.parse(savedUpdates);
      this.statusUpdates = parsed.map((status: any) => ({
        ...status,
        timestamp: new Date(status.timestamp),
        // Ensure backward compatibility for older status objects
        options: status.options || {
          important: false,
          urgent: false,
          completed: false,
          inProgress: false
        },
        visibility: status.visibility || 'public'
      }));
      
      // Find the next available ID
      if (this.statusUpdates.length > 0) {
        this.nextId = Math.max(...this.statusUpdates.map(s => s.id)) + 1;
      }
      
      this.statusSubject.next([...this.statusUpdates]);
    }
  }
}
