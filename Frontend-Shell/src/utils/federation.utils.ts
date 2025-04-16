import { loadRemoteModule as federationLoadRemoteModule } from '@angular-architects/module-federation';

/**
 * Load a remote module using Module Federation
 * @param remoteEntry URL of the remote entry
 * @param remoteName Name of the remote
 * @param exposedModule Module path that is exposed by the remote
 * @returns Promise that resolves to the remote module
 */
export function loadRemoteModule(
  remoteEntry: string,
  remoteName: string,
  exposedModule: string
) {
  console.log(`Loading remote module on demand: ${remoteName}/${exposedModule}`);
  const startTime = performance.now();
  
  // Use standard script-based loading without the 'type' parameter
  return federationLoadRemoteModule({
    remoteEntry,
    remoteName,
    exposedModule
  })
  .then(module => {
    const loadTime = performance.now() - startTime;
    console.log(`Successfully loaded module: ${remoteName}/${exposedModule} in ${loadTime.toFixed(2)}ms`, module);
    // Check for the specific module names we know about
    if (module.SosUpdateModule) {
      console.log('Found SosUpdateModule, returning it');
      return module.SosUpdateModule;
    } 
    if (module.DeploymentReadinessModule) {
      console.log('Found DeploymentReadinessModule, returning it');
      return module.DeploymentReadinessModule;
    }
    if (module.MemeGeneratorModule) {
      console.log('Found MemeGeneratorModule, returning it:', module.MemeGeneratorModule);
      return module.MemeGeneratorModule;
    }
    if (module.AppModule) {
      console.log('No specific module found, but found AppModule, returning it');
      return module.AppModule;
    }
    
    // Enhanced debugging - log what we actually have in the module
    console.log('Available modules/exports:', Object.keys(module));
    console.log('No specific module found, returning entire module');
    return module;
  })
  .catch(err => {
    console.error(`Error loading remote module ${remoteName}/${exposedModule}:`, err);
    console.error('Error details:', JSON.stringify(err));
    throw err;
  });
}

// Export the remote configurations for use in the app
export const remotes = {
  sosUpdate: {
    remoteEntry: '//localhost:4201/remoteEntry.js',
    remoteName: 'sos_update',
    exposedModule: './SosUpdateModule'
  },
  deploymentReadiness: {
    remoteEntry: '//localhost:4202/remoteEntry.js',
    remoteName: 'deployment_readiness',
    exposedModule: './DeploymentReadinessModule'
  },
  memeGenerator: {
    remoteEntry: '//localhost:4203/remoteEntry.js',
    remoteName: 'meme_generator',
    exposedModule: './MemeGeneratorModule'
  },
  statusUpdate: {
    remoteEntry: '//localhost:4204/remoteEntry.js',
    remoteName: 'status_update',
    exposedModule: './StatusUpdateModule'
  },
  f1Tracking: {
    remoteEntry: '//localhost:4205/remoteEntry.js',
    remoteName: 'f1TrackingApp',
    exposedModule: './F1TrackingModule'
  }
};

// For backwards compatibility
export const sosUpdateRemoteEntry = remotes.sosUpdate.remoteEntry;
export const deploymentReadinessRemoteEntry = remotes.deploymentReadiness.remoteEntry;
export const memeGeneratorRemoteEntry = remotes.memeGenerator.remoteEntry;
export const statusUpdateRemoteEntry = remotes.statusUpdate.remoteEntry;
export const f1TrackingRemoteEntry = remotes.f1Tracking.remoteEntry;