import { Component, Inject, OnDestroy } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
declare var $: any;
@Component({
  selector: 'app-shopping-complete-dialog',
  templateUrl: './shopping-complete-dialog.component.html',
  styleUrls: ['./shopping-complete-dialog.component.css'],
})
export class ShoppingCompleteDialogComponent
  extends BaseDialog<ShoppingCompleteDialogComponent>
  implements OnDestroy
{
  constructor(
    dialogRef: MatDialogRef<ShoppingCompleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShoppingCompleteDeleteState
  ) {
    super(dialogRef);
  }

  show: boolean = false;
  onComplete() {
    this.show = true;
    //if cancel clicked, it will show basket modal again ngOnDestroy
  }

  ngOnDestroy(): void {
    //if cancel clicked, it will show basket modal again
    if (!this.show) $('#basketModal').modal('show');
  }
}

export enum ShoppingCompleteDeleteState {
  Yes,
  No,
}
