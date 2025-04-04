import { Component, OnInit, HostListener } from '@angular/core';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Deployment Readiness';
  private currentTheme: Theme = 'light';
  isSideNavOpen = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Close sidenav automatically on larger screens
    if (window.innerWidth > 768 && this.isSideNavOpen) {
      this.isSideNavOpen = false;
    }
  }

  ngOnInit(): void {
    // Check if parent has already set a theme
    const storedTheme = localStorage.getItem('tpm-hub-theme') as Theme;
    if (storedTheme) {
      this.applyTheme(storedTheme);
    }

    // Listen for theme changes from parent shell application
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'theme-change') {
        this.applyTheme(event.data.theme);
      }
    });
  }

  toggleSideNav(): void {
    this.isSideNavOpen = !this.isSideNavOpen;
    
    // Add body class when menu is open to prevent scrolling on mobile
    if (this.isSideNavOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }

  private applyTheme(theme: Theme): void {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }
}
