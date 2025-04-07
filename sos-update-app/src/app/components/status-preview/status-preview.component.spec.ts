import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusPreviewComponent } from './status-preview.component';

describe('StatusPreviewComponent', () => {
  let component: StatusPreviewComponent;
  let fixture: ComponentFixture<StatusPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
