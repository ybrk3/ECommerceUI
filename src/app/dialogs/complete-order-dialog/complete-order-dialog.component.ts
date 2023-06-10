import { Component, Inject } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-complete-order-dialog',
  templateUrl: './complete-order-dialog.component.html',
  styleUrls: ['./complete-order-dialog.component.css'],
})
export class CompleteOrderDialogComponent extends BaseDialog<CompleteOrderDialogComponent> {
  constructor(
    dialogRef: MatDialogRef<CompleteOrderDialogComponent>, //to close dialog box
    @Inject(MAT_DIALOG_DATA) public data: CompleteOrderState.Yes
  ) {
    super(dialogRef);
  }
}

export enum CompleteOrderState {
  Yes,
  No,
}
