import { Injectable, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { FederationDebugService } from './federation-debug.service';
import { remotes } from '../../utils/federation.utils';

@Injectable({
  providedIn: 'root'
})
export class FederationHealthService implements OnDestroy {
  private healthCheckInterval: Subscription | null = null;
  private readonly CHECK_INTERVAL = 30000; // 30 seconds

  constructor(private debugService: FederationDebugService) {
    this.startHealthCheck();
  }

  ngOnDestroy() {
    this.stopHealthCheck();
  }

  private startHealthCheck() {
    this.healthCheckInterval = interval(this.CHECK_INTERVAL).subscribe(() => {
      this.checkAllRemotes();
    });

    // Do an initial check immediately
    this.checkAllRemotes();
  }

  private stopHealthCheck() {
    if (this.healthCheckInterval) {
      this.healthCheckInterval.unsubscribe();
    }
  }

  private checkAllRemotes() {
    Object.entries(remotes).forEach(([name, config]) => {
      const startTime = performance.now();
      fetch(config.remoteEntry)
        .then(response => {
          const loadTime = performance.now() - startTime;
          if (response.ok) {
            this.debugService.trackModuleMetrics(name, loadTime);
          } else {
            throw new Error(`HTTP ${response.status}`);
          }
        })
        .catch(error => {
          const loadTime = performance.now() - startTime;
          this.debugService.trackModuleMetrics(name, loadTime, true);
          this.debugService.debugLog('error', `Health check failed for ${name}`, {
            error: error.message,
            remoteEntry: config.remoteEntry,
            timestamp: new Date().toISOString()
          });
        });
    });
  }
}
