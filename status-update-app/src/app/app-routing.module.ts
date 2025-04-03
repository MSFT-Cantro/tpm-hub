import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatusFormComponent } from './components/status-form/status-form.component';
import { StatusHistoryComponent } from './components/status-history/status-history.component';

const routes: Routes = [
  { path: '', redirectTo: 'status-history', pathMatch: 'full' },
  { path: 'status-form', component: StatusFormComponent },
  { path: 'status-history', component: StatusHistoryComponent },
  { path: '**', redirectTo: 'status-history' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
