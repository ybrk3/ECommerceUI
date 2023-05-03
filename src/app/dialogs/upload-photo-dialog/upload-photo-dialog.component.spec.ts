import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPhotoDialogComponent } from './upload-photo-dialog.component';

describe('UploadPhotoDialogComponent', () => {
  let component: UploadPhotoDialogComponent;
  let fixture: ComponentFixture<UploadPhotoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadPhotoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadPhotoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
