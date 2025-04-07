import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MemeGeneratorComponent } from './components/meme-generator/meme-generator.component';

// Define routes for the main app
const routes: Routes = [
  { path: '', component: MemeGeneratorComponent },
  { path: '**', redirectTo: '' }
];

// Define child routes for the federated module
const childRoutes: Routes = [
  { path: '', component: MemeGeneratorComponent }
];

// Properly defined module for Module Federation - defined first to avoid circular dependency
@NgModule({
  declarations: [
    MemeGeneratorComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(childRoutes),
    FormsModule
  ],
  providers: [],
  exports: [MemeGeneratorComponent]
})
export class MemeGeneratorModule { }

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    MemeGeneratorModule // Import MemeGeneratorModule here to use its components
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }