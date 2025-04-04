import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MemeCreatorComponent } from './components/meme-creator/meme-creator.component';
import { DebugComponent } from './components/debug/debug.component';
import { ErrorLogsComponent } from './components/error-logs/error-logs.component';
import { MemeGeneratorRoutingModule } from './meme-generator-routing.module';
import { ClipboardService } from './services/clipboard.service';
import { ErrorLoggingService } from './services/error-logging.service';

@NgModule({
  declarations: [
    AppComponent,
    MemeCreatorComponent,
    DebugComponent,
    ErrorLogsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MemeGeneratorRoutingModule
  ],
  providers: [
    ClipboardService,
    ErrorLoggingService
  ]
})
export class MemeGeneratorModule { }