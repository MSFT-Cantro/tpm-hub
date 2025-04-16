import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Declare the window interface extension at the top level
declare global {
  interface Window {
    meme_generator?: unknown;
  }
}

if (environment.production) {
  enableProdMode();
}

// This function will bootstrap the application
function bootstrap() {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error('Error bootstrapping app:', err));
}

// Bootstrap only if we're running standalone
if (!window.meme_generator) {
  // If the document is ready, bootstrap immediately
  if (document.readyState === 'complete') {
    bootstrap();
  } else {
    // Otherwise wait for the document to load
    document.addEventListener('DOMContentLoaded', bootstrap);
  }
}