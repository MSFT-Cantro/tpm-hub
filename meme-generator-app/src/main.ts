import { loadRemoteModule } from '@angular-architects/module-federation';

// Don't eagerly import Angular core modules or environment
// Instead, let bootstrap.ts handle it properly

// Use dynamic import for webpack Module Federation
import('./bootstrap')
  .catch(err => console.error('Error bootstrapping app:', err));