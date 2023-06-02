import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeleteState } from '../delete-dialog/delete-dialog.component';
import { BaseDialog } from '../base/base-dialog';
declare var $: any;
@Component({
  selector: 'app-basket-item-remove-dialog',
  templateUrl: './basket-item-remove-dialog.component.html',
  styleUrls: ['./basket-item-remove-dialog.component.css'],
})
export class BasketItemRemoveDialogComponent
  extends BaseDialog<BasketItemRemoveDialogComponent>
  implements OnDestroy
{
  constructor(
    dialogRef: MatDialogRef<BasketItemRemoveDialogComponent>, //to close dialog box
    @Inject(MAT_DIALOG_DATA) public data: BasketItemDeleteState.Yes
  ) {
    super(dialogRef);
  }

  ngOnDestroy(): void {
    $('#basketModal').modal('show');
  }
}
export enum BasketItemDeleteState {
  Yes,
  No,
}
