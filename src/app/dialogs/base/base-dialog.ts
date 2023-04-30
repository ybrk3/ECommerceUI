import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export class BaseDialog<DialogComponent> {
  constructor(public dialogRef: MatDialogRef<DialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
