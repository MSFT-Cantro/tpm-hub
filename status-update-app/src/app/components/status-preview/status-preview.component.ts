import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-status-preview',
  templateUrl: './status-preview.component.html',
  styleUrls: ['./status-preview.component.scss']
})
export class StatusPreviewComponent implements OnInit {
  @Input() message: string = '';
  @Input() author: string = '';
  @Input() timestamp: Date | null = null;
  @Input() important: boolean = false;
  @Input() urgent: boolean = false;
  @Input() completed: boolean = false;
  @Input() inProgress: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
}
