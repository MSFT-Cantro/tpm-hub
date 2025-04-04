import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemeCreatorComponent } from './components/meme-creator/meme-creator.component';
import { DebugComponent } from './components/debug/debug.component';
import { ErrorLogsComponent } from './components/error-logs/error-logs.component';

const routes: Routes = [
  { path: '', component: MemeCreatorComponent },
  { path: 'debug', component: DebugComponent },
  { path: 'error-logs', component: ErrorLogsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemeGeneratorRoutingModule { }