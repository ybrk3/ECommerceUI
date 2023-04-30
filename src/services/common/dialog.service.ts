import { Injectable } from '@angular/core';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { ComponentType } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}
  openDialog(dialogParameters: Partial<DialogParameters>): void {
    const dialogRef = this.dialog.open(dialogParameters.component, {
      width: dialogParameters.options?.width,
      height: dialogParameters.options?.height,
      position: dialogParameters.options?.position,
      data: dialogParameters.data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === dialogParameters.data) dialogParameters.afterClosed();
    });
  }
}

export class DialogParameters {
  component: ComponentType<any>; //the component it will be used
  afterClosed: () => void; //callback function which will be executed after dialog closed
  options?: Partial<DialogOptions>;
  data: any; //data returned after selection on dialog box
}
export class DialogOptions {
  width?: string = '250px';
  height?: string;
  position?: DialogPosition;
}
