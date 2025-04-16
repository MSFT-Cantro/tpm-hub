import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DriversStandingsComponent } from './components/drivers-standings/drivers-standings.component';
import { ConstructorsStandingsComponent } from './components/constructors-standings/constructors-standings.component';

// Routes for both standalone and federated use
const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', redirectTo: 'drivers', pathMatch: 'full' },
      { path: 'drivers', component: DriversStandingsComponent },
      { path: 'constructors', component: ConstructorsStandingsComponent }
    ]
  }
];

// This module will be loaded by the shell application
@NgModule({
  declarations: [
    AppComponent,
    DriversStandingsComponent,
    ConstructorsStandingsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  providers: []
})
export class F1TrackingModule { }

// This module is used when running standalone
@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    F1TrackingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
