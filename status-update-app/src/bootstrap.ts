import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Extend Window interface
declare global {
  interface Window {
    statusUpdateAlreadyLoaded?: boolean;
  }
}

if (environment.production) {
  enableProdMode();
}

// Bootstrap the app only if not loaded via Module Federation
const mount = async () => {
  try {
    const platform = platformBrowserDynamic();
    await platform.bootstrapModule(AppModule);
    console.log('Status Update App Bootstrapped');
  } catch (err) {
    console.error('Error bootstrapping Status Update App:', err);
  }
};

if (!window.statusUpdateAlreadyLoaded) {
  window.statusUpdateAlreadyLoaded = true;
  mount();
}
