import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SosUpdateAppComponent } from './status-update-app.component';

describe('SosUpdateAppComponent', () => {
  let component: SosUpdateAppComponent;
  let fixture: ComponentFixture<SosUpdateAppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SosUpdateAppComponent]
    });
    fixture = TestBed.createComponent(SosUpdateAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
