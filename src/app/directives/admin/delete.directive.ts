import { HttpErrorResponse } from '@angular/common/http';
import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import {
  DeleteDialogComponent,
  DeleteState,
} from 'src/app/dialogs/delete-dialog/delete-dialog.component';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/services/admin/alertify.service';
import { HttpClientService } from 'src/services/common/http-client.service';

//to animation
declare var $: any;

@Directive({
  selector: '[appDelete]',
})
export class DeleteDirective {
  constructor(
    private element: ElementRef, //to get element bound to directive
    private renderer: Renderer2, //to create DOM element
    private htttpClientservice: HttpClientService, //delete from db
    private dialog: MatDialog, //dialog
    private alertify: AlertifyService
  ) {
    //creating "img" element and set its attributes
    const img = renderer.createElement('img');
    img.setAttribute('src', '../../../../../assets/delete.png');
    img.setAttribute('style', 'cursor:pointer;');
    img.width = 25;
    img.height = 25;
    //append created element to its parent node
    renderer.appendChild(element.nativeElement, img);
  }
  @Input() id: string;
  @Input() controller: string;
  //updating the list
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  @HostListener('click')
  async onclick() {
    this.openDialog(() => {
      //set element's parent node to variable (td)
      const td: HTMLTableCellElement = this.element.nativeElement;
      //removing from db
      this.htttpClientservice
        .delete({ controller: this.controller }, this.id)
        .subscribe(
          (data) => {
            //animation through removing the row (its parent node => th)
            $(td.parentElement).animate(
              { opacity: 0, left: '+=50', height: 'toogle' },
              700,
              () => {
                this.onDelete.emit();
                this.alertify.message('Successfully Deleted!', {
                  dismissOthers: true,
                  messageType: MessageType.Success,
                  position: Position.TopRight,
                });
              }
            );
          },
          (errorResponse: HttpErrorResponse) => {
            this.alertify.message('An Error Occured. Please try again!', {
              dismissOthers: true,
              messageType: MessageType.Error,
              position: Position.TopRight,
            });
          }
        );
    });
  }

  openDialog(afterClosed: any): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      data: DeleteState.Yes,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === DeleteState.Yes) afterClosed();
    });
  }
}
