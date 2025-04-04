import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loadRemoteModule, remotes } from '../utils/federation.utils';
import { ErrorLoggingService } from './services/error-logging.service';

// The inline ModuleErrorComponent is now replaced with our enhanced ErrorComponent in the error folder

// Welcome component for the home page
@Component({
  template: `
    <div style="padding: 40px; text-align: center; margin: 20px;">
      <h1 style="font-size: 2.5rem; margin-bottom: 20px; color: var(--text-primary);">Welcome to the TPM Hub 🤹</h1>
      <div style="max-width: 800px; margin: 0 auto; line-height: 1.6;">
        <p style="font-size: 1.2rem; margin-bottom: 30px; color: var(--text-secondary);">Your central platform for managing product updates and deployment readiness.</p>
        <div style="display: flex; justify-content: center; gap: 20px; margin-top: 40px;">
          <a routerLink="/sos-update" style="text-decoration: none;">
            <div class="welcome-card" style="padding: 20px; border-radius: 8px; background: var(--card-bg); min-width: 200px; transition: all 0.3s; border: 1px solid var(--border-color); box-shadow: 0 4px 8px var(--shadow-color);">
              <h3 style="margin-bottom: 10px; color: var(--accent-primary);">SoS Updates</h3>
              <p style="color: var(--text-secondary);">Create and manage SoS updates for your stakeholders</p>
            </div>
          </a>
          <a routerLink="/deployment-readiness" style="text-decoration: none;">
            <div class="welcome-card" style="padding: 20px; border-radius: 8px; background: var(--card-bg); min-width: 200px; transition: all 0.3s; border: 1px solid var(--border-color); box-shadow: 0 4px 8px var(--shadow-color);">
              <h3 style="margin-bottom: 10px; color: var(--accent-primary);">Deployment Readiness</h3>
              <p style="color: var(--text-secondary);">Track and manage release readiness for your products</p>
            </div>
          </a>
          <a routerLink="/meme-generator" style="text-decoration: none;">
            <div class="welcome-card" style="padding: 20px; border-radius: 8px; background: var(--card-bg); min-width: 200px; transition: all 0.3s; border: 1px solid var(--border-color); box-shadow: 0 4px 8px var(--shadow-color);">
              <h3 style="margin-bottom: 10px; color: var(--accent-primary);">Meme Generator</h3>
              <p style="color: var(--text-secondary);">Create custom memes and copy to clipboard</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .welcome-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px var(--shadow-color);
      border-color: var(--accent-primary);
    }
  `]
})
export class WelcomeComponent {}

// Debug component for direct rendering
@Component({
  template: `
    <div style="padding: 20px; border: 2px solid var(--accent-primary); margin: 20px; background: var(--bg-secondary);">
      <h2 style="color: var(--text-primary);">Debug Component</h2>
      <p style="color: var(--text-secondary);">This is a direct component in the shell application.</p>
      <p style="color: var(--text-secondary);">If you can see this, the shell application is working correctly.</p>
      <p style="color: var(--text-secondary);">Timestamp: {{timestamp}}</p>
      <h3 style="color: var(--text-primary);">Application Status:</h3>
      <ul style="color: var(--text-secondary);">
        <li>Frontend Shell: <span style="color: var(--accent-secondary);">✓ Running</span></li>
        <li>SoS Update App: <button (click)="checkApp('http://localhost:4201')" class="debug-check-btn">Check</button> <span id="sos-check">Unknown</span></li>
        <li>Deployment Readiness App: <button (click)="checkApp('http://localhost:4202')" class="debug-check-btn">Check</button> <span id="deployment-check">Unknown</span></li>
        <li>Meme Generator App: <button (click)="checkApp('http://localhost:4203')" class="debug-check-btn">Check</button> <span id="meme-check">Unknown</span></li>
      </ul>
    </div>
  `,
  styles: [`
    .debug-check-btn {
      background: none; 
      border: none; 
      color: var(--accent-primary); 
      text-decoration: underline; 
      cursor: pointer;
    }
    
    .debug-check-btn:hover {
      color: var(--accent-secondary);
    }
  `]
})
export class DebugComponent {
  timestamp = new Date().toISOString();
  
  checkApp(url: string) {
    let id = url.includes('4201') ? 'sos-check' : (url.includes('4202') ? 'deployment-check' : 'meme-check');
    const element = document.getElementById(id);
    if (element) {
      element.textContent = 'Checking...';
      element.style.color = 'orange';
    }
    
    fetch(url)
      .then(response => {
        if (element) {
          element.textContent = '✓ Running';
          element.style.color = 'green';
        }
      })
      .catch(err => {
        if (element) {
          element.textContent = '✗ Not Running';
          element.style.color = 'red';
        }
      });
  }
}

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'debug', component: DebugComponent },
  { 
    path: 'error',
    loadChildren: () => import('./components/error/error.module').then(m => m.ErrorModule)
  },
  {
    path: 'sos-update',
    loadChildren: () => {
      console.log('Loading sos-update module');
      return loadRemoteModule(
        remotes.sosUpdate.remoteEntry,
        remotes.sosUpdate.remoteName,
        remotes.sosUpdate.exposedModule
      ).catch(err => {
        console.error('Error loading sos-update module:', err);
        localStorage.setItem('moduleLoadError', err.toString());
        // Use the ErrorLoggingService to log the federation error
        const errorService = new ErrorLoggingService();
        errorService.logFederationError(`Failed to load sos-update module: ${err.message || err}`, {
          remoteEntry: remotes.sosUpdate.remoteEntry,
          remoteName: remotes.sosUpdate.remoteName,
          exposedModule: remotes.sosUpdate.exposedModule
        });
        window.location.href = '/error';
        return import('./components/error/error.module').then(m => m.ErrorModule);
      });
    }
  },
  {
    path: 'deployment-readiness',
    loadChildren: () => {
      console.log('Loading deployment-readiness module');
      return loadRemoteModule(
        remotes.deploymentReadiness.remoteEntry,
        remotes.deploymentReadiness.remoteName,
        remotes.deploymentReadiness.exposedModule
      ).catch(err => {
        console.error('Error loading deployment-readiness module:', err);
        localStorage.setItem('moduleLoadError', err.toString());
        // Use the ErrorLoggingService to log the federation error
        const errorService = new ErrorLoggingService();
        errorService.logFederationError(`Failed to load deployment-readiness module: ${err.message || err}`, {
          remoteEntry: remotes.deploymentReadiness.remoteEntry,
          remoteName: remotes.deploymentReadiness.remoteName,
          exposedModule: remotes.deploymentReadiness.exposedModule
        });
        window.location.href = '/error';
        return import('./components/error/error.module').then(m => m.ErrorModule);
      });
    }
  },
  {
    path: 'meme-generator',
    loadChildren: () => {
      console.log('Loading meme-generator module');
      return loadRemoteModule(
        remotes.memeGenerator.remoteEntry,
        remotes.memeGenerator.remoteName,
        remotes.memeGenerator.exposedModule
      ).catch(err => {
        console.error('Error loading meme-generator module:', err);
        localStorage.setItem('moduleLoadError', err.toString());
        // Use the ErrorLoggingService to log the federation error
        const errorService = new ErrorLoggingService();
        errorService.logFederationError(`Failed to load meme-generator module: ${err.message || err}`, {
          remoteEntry: remotes.memeGenerator.remoteEntry,
          remoteName: remotes.memeGenerator.remoteName,
          exposedModule: remotes.memeGenerator.exposedModule
        });
        window.location.href = '/error';
        return import('./components/error/error.module').then(m => m.ErrorModule);
      });
    }
  },
  { path: '**', redirectTo: 'welcome' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [WelcomeComponent, DebugComponent]
})
export class AppRoutingModule { }
