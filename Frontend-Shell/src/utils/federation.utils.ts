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
  console.log(`Loading remote module: ${remoteName}/${exposedModule}`);
  return federationLoadRemoteModule({
    remoteEntry,
    remoteName,
    exposedModule
  })
  .then(module => {
    console.log(`Successfully loaded module: ${remoteName}/${exposedModule}`, module);
    // Check for the specific module names we know about
    if (module.SosUpdateModule) {
      console.log('Found SosUpdateModule, returning it');
      return module.SosUpdateModule;
    } 
    if (module.DeploymentReadinessModule) {
      console.log('Found DeploymentReadinessModule, returning it');
      return module.DeploymentReadinessModule;
    }
    if (module.AppModule) {
      console.log('Found AppModule, returning it');
      return module.AppModule;
    }
    // If we don't find a specific module, return the whole module
    console.log('No specific module found, returning entire module');
    return module;
  })
  .catch(err => {
    console.error(`Error loading remote module ${remoteName}/${exposedModule}:`, err);
    throw err;
  });
}

// Export the remote configurations for use in the app
export const remotes = {
  sosUpdate: {
    remoteEntry: 'http://localhost:4201/remoteEntry.js',
    remoteName: 'sos_update',
    exposedModule: './SosUpdateModule'
  },
  deploymentReadiness: {
    remoteEntry: 'http://localhost:4202/remoteEntry.js',
    remoteName: 'deployment_readiness',
    exposedModule: './DeploymentReadinessModule'
  }
};

// For backwards compatibility
export const sosUpdateRemoteEntry = remotes.sosUpdate.remoteEntry;
export const deploymentReadinessRemoteEntry = remotes.deploymentReadiness.remoteEntry;