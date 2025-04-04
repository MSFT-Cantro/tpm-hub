import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'TPM Hub';
  currentTime = new Date().toLocaleString();
  debugPanelVisible = false;
  settingsModalVisible = false;
  isSideNavOpen = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Close sidenav automatically on larger screens
    if (window.innerWidth > 768 && this.isSideNavOpen) {
      this.isSideNavOpen = false;
    }
  }

  constructor(
    private http: HttpClient,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    // Update time every second
    setInterval(() => {
      this.currentTime = new Date().toLocaleString();
    }, 1000);
    
    // The theme service is automatically initialized when injected
  }

  toggleSideNav(): void {
    this.isSideNavOpen = !this.isSideNavOpen;
    
    // Prevent body scrolling when menu is open on mobile
    if (this.isSideNavOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }

  toggleDebugPanel() {
    this.debugPanelVisible = !this.debugPanelVisible;
    if (this.debugPanelVisible) {
      this.checkMicroFrontends();
    }
  }

  toggleSettingsModal() {
    this.settingsModalVisible = !this.settingsModalVisible;
  }

  closeSettingsModal() {
    this.settingsModalVisible = false;
  }

  checkMicroFrontends() {
    // Check SoS update app
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
