import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'TPM Hub';
  currentTime = new Date().toLocaleString();
  debugPanelVisible = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Update time every second
    setInterval(() => {
      this.currentTime = new Date().toLocaleString();
    }, 1000);
  }

  toggleDebugPanel() {
    this.debugPanelVisible = !this.debugPanelVisible;
    if (this.debugPanelVisible) {
      this.checkMicroFrontends();
    }
  }

  checkMicroFrontends() {
    // Check status update app
    this.checkEndpoint('http://localhost:4201', 'status-mfe');
    
    // Check release notes app
    this.checkEndpoint('http://localhost:4202', 'release-mfe');
  }

  private checkEndpoint(url: string, elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = 'Checking...';
      element.style.color = 'orange';
    }

    this.http.get(url, { responseType: 'text' })
      .subscribe(
        () => {
          if (element) {
            element.textContent = 'Running ✓';
            element.style.color = 'green';
          }
        },
        (error) => {
          console.error(`Error checking ${url}:`, error);
          if (element) {
            element.textContent = 'Not Running ✗';
            element.style.color = 'red';
          }
        }
      );
  }
}
