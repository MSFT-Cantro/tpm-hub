import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss']
})
export class SettingsModalComponent {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  
  constructor(public themeService: ThemeService) {}
  
  closeModal(): void {
    this.close.emit();
  }
  
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
  
  toggleDebug(): void {
    const debugUrl = '/debug';
    window.location.href = debugUrl;
  }
}
