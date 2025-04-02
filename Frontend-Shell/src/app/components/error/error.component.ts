import { Component } from '@angular/core';

@Component({
  selector: 'app-error',
  template: `
    <div style="padding: 20px; border: 2px solid #d32f2f; margin: 20px; background: #ffebee;">
      <h2>Module Loading Error</h2>
      <p>Failed to load the requested micro frontend application.</p>
      <h3>Possible causes:</h3>
      <ul>
        <li>The micro frontend application is not running</li>
        <li>There's a version compatibility issue between applications</li>
        <li>Network connectivity issues</li>
      </ul>
      <button (click)="goBack()" style="padding: 8px 16px; background: #2196f3; color: white; border: none; cursor: pointer; margin-right: 10px;">
        Go Back
      </button>
      <button (click)="refresh()" style="padding: 8px 16px; background: #4caf50; color: white; border: none; cursor: pointer;">
        Refresh Page
      </button>
    </div>
  `
})
export class ErrorComponent {
  goBack() {
    window.history.back();
  }
  
  refresh() {
    window.location.reload();
  }
}