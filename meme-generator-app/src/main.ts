import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';

// Properly handling dynamic imports for module federation
// This helps prevent "[object Event]" errors that can occur with
// improper bootstrapping in federated modules
if (environment.production) {
  enableProdMode();
}

// Use dynamic import to ensure webpack properly handles the module federation setup
import('./bootstrap')
  .catch(err => console.error('Error bootstrapping app:', err));