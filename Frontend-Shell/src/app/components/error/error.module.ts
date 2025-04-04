import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ErrorComponent } from './error.component';
import { ErrorLogsComponent } from './error-logs.component';

@NgModule({
  declarations: [ErrorComponent, ErrorLogsComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: ErrorComponent }
    ])
  ]
})
export class ErrorModule { }