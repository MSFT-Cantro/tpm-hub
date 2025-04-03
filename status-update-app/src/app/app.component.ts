import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SoS Update App';
  private currentTheme: Theme = 'light';
  
  constructor(public router: Router) {}

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
