import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReleaseNotesComponent } from './components/release-notes/release-notes.component';

const routes: Routes = [
  // Updated route config for micro frontend
  { path: '', component: ReleaseNotesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
