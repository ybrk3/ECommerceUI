import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseDialog } from '../base/base-dialog';

@Component({
  selector: 'app-authorize-menu-dialog',
  templateUrl: './authorize-menu-dialog.component.html',
  styleUrls: ['./authorize-menu-dialog.component.css'],
})
export class AuthorizeMenuDialogComponent extends BaseDialog<AuthorizeMenuDialogComponent> {
  constructor(
    dialogRef: MatDialogRef<AuthorizeMenuDialogComponent>, //to close dialog box
    @Inject(MAT_DIALOG_DATA) public data: { actionCode: string; name: string }
  ) {
    super(dialogRef);
  }
}
