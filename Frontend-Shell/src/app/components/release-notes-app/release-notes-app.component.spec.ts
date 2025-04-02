import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseNotesAppComponent } from './release-notes-app.component';

describe('ReleaseNotesAppComponent', () => {
  let component: ReleaseNotesAppComponent;
  let fixture: ComponentFixture<ReleaseNotesAppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReleaseNotesAppComponent]
    });
    fixture = TestBed.createComponent(ReleaseNotesAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
