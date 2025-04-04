import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// Import for initialization of shared scope
import { MemeGeneratorModule } from './app/meme-generator.module'; // Fixed import path

// Bootstrap the application asynchronously after all shared dependencies are loaded
async function initializeApp() {
  try {
    // Dynamically import the environment to prevent eager loading issues
    const { environment } = await import('./environments/environment');
    
    if (environment.production) {
      enableProdMode();
    }
    
    // Improved logic to determine if we're running as a standalone app or as a remote
    // This ignores protocol differences that might cause infinite loops
    const isRemoteEntry = window.location.pathname.includes('remoteEntry.js');
    const isExpectedPort = window.location.port === '4203';
    const isStandalone = !isRemoteEntry && (isExpectedPort || window === window.parent);
    
    if (isStandalone) {
      console.log('Running in standalone mode, bootstrapping application');
      // Now bootstrap the application
      await platformBrowserDynamic()
        .bootstrapModule(MemeGeneratorModule)
        .catch(err => console.error('Angular bootstrap error:', err));
    } else {
      console.log('Running as a remote, skipping bootstrap');
    }
      
  } catch (error) {
    console.error('Error initializing application:', error);
  }
}

// Initialize the application only once
initializeApp();