import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MemeGeneratorComponent } from './components/meme-generator/meme-generator.component';

// Routes for both standalone and federated use
const routes: Routes = [
  { path: '', component: MemeGeneratorComponent }
];

// This module will be loaded by the shell application
@NgModule({
  declarations: [MemeGeneratorComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  providers: []
})
export class MemeGeneratorModule { }

// This module is used when running standalone
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    MemeGeneratorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }