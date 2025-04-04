import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';
import { ErrorLoggingService } from './services/error-logging.service';

// Custom error handler to capture Angular errors
@Injectable()
class GlobalErrorHandler implements ErrorHandler {
  constructor(private errorLoggingService: ErrorLoggingService) {}

  handleError(error: any): void {
    // Log the error with our error logging service
    this.errorLoggingService.logAngularError(error);
    
    // Rethrow the error to maintain default Angular behavior
    console.error('Error caught by global error handler:', error);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ThemeToggleComponent,
    SettingsModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    ErrorLoggingService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
