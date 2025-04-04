import { Component, OnInit } from '@angular/core';
import { ErrorLoggingService } from '../../services/error-logging.service';

@Component({
  selector: 'app-error',
  template: `
    <div class="error-container">
      <div class="error-card">
        <h2><span class="error-icon">⚠️</span> Module Loading Error</h2>
        <p class="error-message">{{ errorMessage }}</p>
        <hr class="divider" />
        
        <h3>Possible causes:</h3>
        <ul class="error-causes">
          <li>The micro frontend application is not running</li>
          <li>There's a version compatibility issue between applications</li>
          <li>Network connectivity issues</li>
          <li>Incorrect module federation configuration</li>
        </ul>
        
        <div class="debug-details">
          <details>
            <summary>Technical Details</summary>
            <div class="debug-content">
              <h4>Last Error:</h4>
              <pre class="error-details">{{ lastErrorDetails }}</pre>
              
              <h4>Debug Information:</h4>
              <div class="debug-info">
                <div><strong>Time:</strong> {{ currentTime }}</div>
                <div><strong>URL:</strong> {{ currentUrl }}</div>
                <div><strong>Shell Version:</strong> 1.0.0</div>
              </div>
            </div>
          </details>
        </div>
        
        <div class="action-buttons">
          <button (click)="goBack()" class="back-btn">
            <span class="button-icon">←</span> Go Back
          </button>
          <button (click)="refresh()" class="refresh-btn">
            <span class="button-icon">↻</span> Refresh Page
          </button>
        </div>
      </div>
      
      <!-- Error Logs Component -->
      <app-error-logs></app-error-logs>
    </div>
  `,
  styles: [`
    .error-container {
      padding: 20px;
      max-width: 900px;
      margin: 0 auto;
      font-family: var(--font-family, sans-serif);
    }
    
    .error-card {
      padding: 25px;
      border-radius: 8px;
      background: var(--bg-secondary, #f5f5f5);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      border-left: 5px solid var(--danger, #d32f2f);
    }
    
    .error-icon {
      font-size: 1.2em;
      margin-right: 8px;
    }
    
    h2 {
      color: var(--danger, #d32f2f);
      margin-top: 0;
      display: flex;
      align-items: center;
    }
    
    .error-message {
      color: var(--text-primary, #333);
      font-size: 1.1em;
      margin-bottom: 20px;
    }
    
    .divider {
      border: none;
      border-top: 1px solid var(--border-color, #ddd);
      margin: 20px 0;
    }
    
    .error-causes {
      color: var(--text-secondary, #555);
      line-height: 1.6;
    }
    
    .debug-details {
      margin: 20px 0;
    }
    
    .debug-details summary {
      cursor: pointer;
      color: var(--accent-primary, #2196f3);
      font-weight: 500;
      padding: 8px 0;
    }
    
    .debug-content {
      padding: 15px;
      background: var(--bg-tertiary, #e0e0e0);
      border-radius: 4px;
      margin-top: 10px;
    }
    
    .error-details {
      background: rgba(0, 0, 0, 0.05);
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
      font-family: monospace;
      white-space: pre-wrap;
      word-break: break-word;
    }
    
    .debug-info {
      margin-top: 15px;
      line-height: 1.6;
    }
    
    .action-buttons {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    
    button {
      padding: 10px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      transition: background-color 0.2s, transform 0.1s;
    }
    
    button:hover {
      transform: translateY(-2px);
    }
    
    button:active {
      transform: translateY(0);
    }
    
    .back-btn {
      background: var(--accent-primary, #2196f3);
      color: white;
    }
    
    .refresh-btn {
      background: var(--success, #4caf50);
      color: white;
    }
    
    .button-icon {
      margin-right: 6px;
    }
  `]
})
export class ErrorComponent implements OnInit {
  errorMessage = 'Failed to load the requested micro frontend application.';
  lastErrorDetails = 'No specific error details available';
  currentTime = new Date().toLocaleString();
  currentUrl = window.location.href;
  
  constructor(private errorLoggingService: ErrorLoggingService) {}
  
  ngOnInit(): void {
    // Try to get the error message from localStorage
    const storedError = localStorage.getItem('moduleLoadError');
    if (storedError) {
      this.errorMessage = 'Failed to load the requested micro frontend application.';
      this.lastErrorDetails = storedError;
      
      // Log this error to our error logging service
      this.errorLoggingService.logFederationError(storedError, {
        timestamp: new Date().toISOString(),
        url: window.location.href
      });
      
      // Clear the error from localStorage
      localStorage.removeItem('moduleLoadError');
    }
  }
  
  goBack(): void {
    window.history.back();
  }
  
  refresh(): void {
    window.location.reload();
  }
}