import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {
  constructor() { }

  /**
   * Copies an image to the clipboard
   * @param imageData The image data in Base64 format to copy to clipboard
   * @returns A Promise that resolves when the copy is successful
   */
  async copyImageToClipboard(imageData: string): Promise<void> {
    try {
      // Remove the data URL prefix to get just the base64 content
      const base64Data = imageData.split(',')[1];
      
      // Convert base64 to blob
      const response = await fetch(imageData);
      const blob = await response.blob();

      // Use the clipboard API to write the blob to the clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      console.log('Image copied to clipboard successfully');
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to copy image to clipboard:', error);
      return Promise.reject(error);
    }
  }
}