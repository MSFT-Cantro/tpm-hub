import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { SosUpdateModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// This is crucial for Module Federation to work correctly
// We need to ensure the application doesn't start until the document is ready
function bootstrap() {
  // Only bootstrap if running standalone (not as a remote in Module Federation)
  const isRunningStandalone = window.location.port === '4201'; // SoS update app runs on port 4201
  
  if (isRunningStandalone) {
    platformBrowserDynamic()
      .bootstrapModule(SosUpdateModule)
      .catch(err => console.error(err));
  } else {
    console.log('SoS Update App: Running as a remote, skipping bootstrap');
  }
}

// If the document is already ready, bootstrap the application immediately
if (document.readyState === 'complete') {
  bootstrap();
} else {
  // Otherwise wait for the document to load before bootstrapping
  document.addEventListener('DOMContentLoaded', bootstrap);
}