import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusUpdateAppComponent } from './status-update-app.component';

describe('StatusUpdateAppComponent', () => {
  let component: StatusUpdateAppComponent;
  let fixture: ComponentFixture<StatusUpdateAppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatusUpdateAppComponent]
    });
    fixture = TestBed.createComponent(StatusUpdateAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
