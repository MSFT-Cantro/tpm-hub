import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { StatusUpdateModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(StatusUpdateModule)
  .catch(err => console.error(err));
