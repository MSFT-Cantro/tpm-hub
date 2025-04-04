import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; // Keep BrowserModule for standalone mode
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MemeCreatorComponent } from './components/meme-creator/meme-creator.component';
import { DebugComponent } from './components/debug/debug.component';
import { ErrorLogsComponent } from './components/error-logs/error-logs.component';
import { GlobalErrorHandler } from './services/global-error-handler';
import { ErrorLoggingService } from './services/error-logging.service';
import { MemeGeneratorRoutingModule } from './meme-generator-routing.module';
import { ClipboardService } from './services/clipboard.service';

@NgModule({
  declarations: [
    AppComponent,
    MemeCreatorComponent,
    DebugComponent,
    ErrorLogsComponent
  ],
  imports: [
    BrowserModule, // Keep for standalone mode
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MemeGeneratorRoutingModule
  ],
  providers: [
    ClipboardService,
    ErrorLoggingService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  bootstrap: [AppComponent] // Keep for standalone mode
})
export class AppModule { }