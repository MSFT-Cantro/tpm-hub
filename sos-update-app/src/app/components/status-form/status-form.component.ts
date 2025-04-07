import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatusService } from '../../services/status.service';
import { Status } from '../../models/status.model';

@Component({
  selector: 'app-status-form',
  templateUrl: './status-form.component.html',
  styleUrls: ['./status-form.component.scss']
})
export class StatusFormComponent implements OnInit {
  @Output() statusCreated = new EventEmitter<Status>();
  
  statusForm: FormGroup;
  currentStatus: string = '';
  authorName: string = '';
  previewMode: boolean = false;
  previewTimestamp: Date | null = null;
  
  // Status option flags
  statusOptions = {
    important: false,
    urgent: false,
    completed: false,
    inProgress: false
  };
  
  // Visibility setting
  visibility: 'public' | 'team' | 'private' = 'public';

  constructor(
    private fb: FormBuilder,
    private statusService: StatusService
  ) { 
    this.statusForm = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(280)]],
      author: ['', Validators.required],
      important: [false],
      urgent: [false],
      completed: [false],
      inProgress: [false],
      visibility: ['public']
    });
  }

  ngOnInit(): void {
    // Try to load saved author from localStorage
    const savedAuthor = localStorage.getItem('statusAuthor');
    if (savedAuthor) {
      this.statusForm.patchValue({ author: savedAuthor });
    }
    
    // Subscribe to option changes
    this.subscribeToOptionChanges();
  }
  
  subscribeToOptionChanges(): void {
    // Subscribe to status option changes
    ['important', 'urgent', 'completed', 'inProgress'].forEach(option => {
      this.statusForm.get(option)?.valueChanges.subscribe(value => {
        this.statusOptions[option as keyof typeof this.statusOptions] = value;
      });
    });
    
    // Subscribe to visibility changes
    this.statusForm.get('visibility')?.valueChanges.subscribe(value => {
      this.visibility = value as 'public' | 'team' | 'private';
    });
  }

  toggleOption(option: string): void {
    const currentValue = this.statusForm.get(option)?.value;
    this.statusForm.get(option)?.setValue(!currentValue);
  }
  
  setVisibility(value: 'public' | 'team' | 'private'): void {
    this.statusForm.get('visibility')?.setValue(value);
  }

  togglePreview(): void {
    if (this.statusForm.invalid) {
      this.markFormGroupTouched(this.statusForm);
      return;
    }
    this.previewMode = !this.previewMode;
    this.currentStatus = this.statusForm.get('message')?.value;
    this.authorName = this.statusForm.get('author')?.value;
    this.previewTimestamp = this.previewMode ? new Date() : null;
  }

  submitStatus(): void {
    if (this.statusForm.invalid) {
      this.markFormGroupTouched(this.statusForm);
      return;
    }

    const message = this.statusForm.get('message')?.value;
    const author = this.statusForm.get('author')?.value;
    
    // Save author for future use
    localStorage.setItem('statusAuthor', author);
    
    // Add status via service with additional options
    const newStatus = this.statusService.addStatus(
      message, 
      author,
      {
        options: this.statusOptions,
        visibility: this.visibility
      }
    );
    
    // Emit event
    this.statusCreated.emit(newStatus);
    
    // Reset form and preview mode
    this.statusForm.get('message')?.reset();
    this.previewMode = false;
    this.previewTimestamp = null;
    
    // Reset options
    this.resetOptions();
  }
  
  resetOptions(): void {
    // Reset status options
    ['important', 'urgent', 'completed', 'inProgress'].forEach(option => {
      this.statusForm.get(option)?.setValue(false);
    });
    
    // Reset visibility to public
    this.statusForm.get('visibility')?.setValue('public');
  }

  cancelPreview(): void {
    this.previewMode = false;
    this.previewTimestamp = null;
  }

  // Helper to mark all controls as touched for validation display
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
