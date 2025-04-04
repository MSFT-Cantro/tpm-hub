import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meme, MemeTemplate } from '../../models/meme.model';
import { ClipboardService } from '../../services/clipboard.service';
import { toPng } from 'html-to-image';

@Component({
  selector: 'app-meme-creator',
  templateUrl: './meme-creator.component.html',
  styleUrls: ['./meme-creator.component.scss']
})
export class MemeCreatorComponent implements OnInit {
  @ViewChild('memeCanvas', { static: false }) memeCanvas!: ElementRef;
  
  memeForm!: FormGroup;
  previewMeme: Meme = {
    topText: '',
    bottomText: '',
    imageUrl: ''
  };
  
  selectedFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  copySuccess = false;
  errorMessage = '';
  
  // Updated meme templates with online image URLs
  templates: MemeTemplate[] = [
    { id: 1, name: 'Drake', url: 'https://imgflip.com/s/meme/Drake-Hotline-Bling.jpg' },
    { id: 2, name: 'Distracted Boyfriend', url: 'https://imgflip.com/s/meme/Distracted-Boyfriend.jpg' },
    { id: 3, name: 'Two Buttons', url: 'https://imgflip.com/s/meme/Two-Buttons.jpg' },
    { id: 4, name: 'Change My Mind', url: 'https://imgflip.com/s/meme/Change-My-Mind.jpg' },
    { id: 5, name: 'Expanding Brain', url: 'https://imgflip.com/s/meme/Expanding-Brain.jpg' },
    { id: 6, name: 'Woman Yelling at Cat', url: 'https://imgflip.com/s/meme/Woman-Yelling-at-Cat.jpg' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private clipboardService: ClipboardService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.memeForm = this.formBuilder.group({
      topText: ['', [Validators.maxLength(100)]],
      bottomText: ['', [Validators.maxLength(100)]],
      templateId: ['']
    });

    // Update preview meme when form values change
    this.memeForm.valueChanges.subscribe(values => {
      this.previewMeme.topText = values.topText;
      this.previewMeme.bottomText = values.bottomText;
      
      if (values.templateId && !this.selectedFile) {
        const selectedTemplate = this.templates.find(t => t.id === parseInt(values.templateId));
        if (selectedTemplate) {
          this.previewMeme.imageUrl = selectedTemplate.url;
        }
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      // Reset template selection
      this.memeForm.patchValue({ templateId: '' });
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
        this.previewMeme.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onTemplateSelected(): void {
    // Reset custom image when a template is selected
    this.selectedFile = null;
    this.imagePreviewUrl = null;
  }

  async copyToClipboard(): Promise<void> {
    try {
      this.errorMessage = '';
      this.copySuccess = false;
      
      if (!this.memeCanvas) {
        throw new Error('Canvas element not found');
      }
      
      // Convert the meme to an image using html-to-image
      const dataUrl = await toPng(this.memeCanvas.nativeElement);
      
      // Copy the image to clipboard
      await this.clipboardService.copyImageToClipboard(dataUrl);
      
      this.copySuccess = true;
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        this.copySuccess = false;
      }, 3000);
    } catch (error) {
      console.error('Failed to copy meme to clipboard:', error);
      this.errorMessage = 'Failed to copy meme to clipboard. Please try again.';
    }
  }

  resetForm(): void {
    this.memeForm.reset();
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.previewMeme = {
      topText: '',
      bottomText: '',
      imageUrl: ''
    };
    this.errorMessage = '';
    this.copySuccess = false;
  }
}