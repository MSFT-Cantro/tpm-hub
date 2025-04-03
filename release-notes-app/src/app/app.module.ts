import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  // Changed from BrowserModule
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReleaseNotesComponent } from './components/release-notes/release-notes.component';

@NgModule({
  declarations: [
    AppComponent,
    ReleaseNotesComponent
  ],
  imports: [
    CommonModule,  // Changed from BrowserModule
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  // Remove bootstrap array for loadable modules
})
export class DeploymentReadinessModule { }
