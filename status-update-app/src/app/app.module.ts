import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';

const routes = [
  { path: '', component: AppComponent }
];

// This module will be loaded by the shell application
@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: []
})
export class StatusUpdateModule { }

// This module is used when running standalone
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    StatusUpdateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
