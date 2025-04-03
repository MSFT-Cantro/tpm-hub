import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() title: string = 'Modal Title';
  @Input() isOpen: boolean = false;
  @Input() closeOnBackdrop: boolean = true;
  @Output() closed = new EventEmitter<void>();

  constructor() { }

  open() {
    this.isOpen = true;
    document.body.classList.add('modal-open');
  }

  close() {
    this.isOpen = false;
    document.body.classList.remove('modal-open');
    this.closed.emit();
  }
}
