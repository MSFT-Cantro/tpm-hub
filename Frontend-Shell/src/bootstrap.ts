import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { remotes } from './utils/federation.utils';

// Create a more reliable script loading function with timeout
const loadRemoteWithTimeout = (remoteEntry: string, timeout = 10000) => {
  return new Promise<void>((resolve, reject) => {
    console.log(`Attempting to load remote entry: ${remoteEntry}`);
    
    // Create a timeout to prevent hanging if the script fails to load
    const timeoutId = setTimeout(() => {
      console.error(`Timeout loading remote entry: ${remoteEntry}`);
      reject(new Error(`Timeout loading remote entry: ${remoteEntry}`));
    }, timeout);
    
    try {
      const script = document.createElement('script');
      script.src = remoteEntry;
      
      script.onerror = (error) => {
        clearTimeout(timeoutId);
        console.error(`Error loading remote entry ${remoteEntry}:`, error);
        reject(new Error(`Failed to load remote entry: ${remoteEntry}`));
      };
      
      script.onload = () => {
        clearTimeout(timeoutId);
        console.log(`Remote entry loaded successfully: ${remoteEntry}`);
        
        // Add a small delay to ensure the module is fully initialized
        setTimeout(() => {
          // Verify the remote module is properly initialized
          try {
            // @ts-ignore
            const remoteName = remoteEntry.includes('4201') ? 'status-update' : 'release-notes';
            // @ts-ignore
            const container = window[remoteName];
            
            if (container && typeof container.get === 'function') {
              console.log(`Remote ${remoteName} initialized correctly`);
              resolve();
            } else {
              console.warn(`Remote ${remoteName} loaded but may not be initialized correctly`);
              // We'll resolve anyway and hope for the best
              resolve();
            }
          } catch (err) {
            console.warn(`Error checking remote initialization:`, err);
            // Continue anyway - the error might be in our verification code
            resolve();
          }
        }, 100);
      };
      
      document.head.appendChild(script);
    } catch (err) {
      clearTimeout(timeoutId);
      console.error(`Error setting up remote ${remoteEntry}:`, err);
      reject(err);
    }
  });
};

console.log('Bootstrap process starting - April 2025 TPM Hub');

// Initialize the federation before bootstrapping the application
Promise.all([
  // Load each remote entry with extended timeout
  loadRemoteWithTimeout(remotes.sosUpdate.remoteEntry, 15000),
  loadRemoteWithTimeout(remotes.deploymentReadiness.remoteEntry, 15000)
])
  .then(() => {
    console.log('All remote entries loaded successfully - starting bootstrap');
    return platformBrowserDynamic().bootstrapModule(AppModule);
  })
  .then(module => {
    console.log('Application bootstrapped successfully!');
  })
  .catch(err => {
    console.error('Critical error during application initialization:', err);
    
    // Display a fallback UI in case of catastrophic failure
    document.body.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #d32f2f;">Application Error</h1>
        <p>The application failed to initialize properly. This may be due to:</p>
        <ul>
          <li>Network connectivity issues</li>
          <li>One or more micro frontend applications not running</li>
          <li>Version compatibility issues between applications</li>
        </ul>
        <p>Please check that all applications are running and try again.</p>
        <button onclick="location.reload()" style="padding: 8px 16px; background: #2196f3; color: white; border: none; cursor: pointer;">
          Reload Application
        </button>
        <div style="margin-top: 30px; padding: 15px; background: #f5f5f5; border-left: 5px solid #d32f2f;">
          <h3>Technical Details</h3>
          <pre style="overflow-x: auto;">${err ? err.toString() : 'Unknown error'}</pre>
        </div>
      </div>
    `;
  });
