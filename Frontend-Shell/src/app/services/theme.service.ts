import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private themeSubject = new BehaviorSubject<Theme>(this.getStoredTheme());
  public theme$ = this.themeSubject.asObservable();
  
  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initTheme();
  }
  
  private getStoredTheme(): Theme {
    const storedTheme = localStorage.getItem('tpm-hub-theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }
    
    // If no theme is stored, check for system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light'; // Default theme
  }
  
  private initTheme(): void {
    const theme = this.themeSubject.getValue();
    this.applyTheme(theme);
    
    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('tpm-hub-theme')) {
          // Only auto-switch if the user hasn't manually set a preference
          this.setTheme(e.matches ? 'dark' : 'light', false);
        }
      });
    }
  }
  
  public getCurrentTheme(): Theme {
    return this.themeSubject.getValue();
  }
  
  public setTheme(theme: Theme, saveToStorage = true): void {
    if (saveToStorage) {
      localStorage.setItem('tpm-hub-theme', theme);
    }
    
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }
  
  public toggleTheme(): void {
    const newTheme = this.themeSubject.getValue() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
  
  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply theme class to the body for global styling
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
    
    // Broadcast theme change to micro frontends
    this.broadcastThemeToMicroFrontends(theme);
  }

  private broadcastThemeToMicroFrontends(theme: Theme): void {
    // Find all iframes that could be micro frontends
    const iframes = document.querySelectorAll('iframe');
    
    iframes.forEach(iframe => {
      try {
        // Post message to each iframe with the new theme
        iframe.contentWindow?.postMessage({
          type: 'theme-change',
          theme: theme
        }, '*');
      } catch (e) {
        console.warn('Failed to send theme to iframe:', e);
      }
    });
  }
}