import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Changed from BrowserModule
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StatusFormComponent } from './components/status-form/status-form.component';
import { StatusPreviewComponent } from './components/status-preview/status-preview.component';
import { StatusHistoryComponent } from './components/status-history/status-history.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    StatusFormComponent,
    StatusPreviewComponent,
    StatusHistoryComponent,
    NavigationComponent,
    ModalComponent
  ],
  imports: [
    CommonModule, // Changed from BrowserModule
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: []
  // Removed bootstrap array as it's not needed in micro-frontend modules
})
export class SosUpdateModule { }
