import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

console.log('Bootstrap process starting - TPM Hub');

// Bootstrap the Shell application without loading any remote entries
platformBrowserDynamic().bootstrapModule(AppModule)
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
