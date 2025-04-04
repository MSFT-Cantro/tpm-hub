import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ThemeToggleComponent,
    SettingsModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
