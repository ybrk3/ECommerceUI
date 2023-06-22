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

import {
  DeleteDialogComponent,
  DeleteState,
} from 'src/app/dialogs/delete-dialog/delete-dialog.component';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/services/admin/alertify.service';
import { DialogService } from 'src/services/common/dialog.service';
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
    private alertify: AlertifyService,
    private dialogService: DialogService //to define callback function and parameters of dialog box
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
    this.dialogService.openDialog({
      component: DeleteDialogComponent,
      data: DeleteState.Yes,
      options: { width: '275px' },
      afterClosed: async () => this.deleteElement(),
    });
  }

  //callback function to be executed after confirmation through dialog box
  async deleteElement() {
    //set element's parent node to variable (td)
    const td: HTMLTableCellElement = this.element.nativeElement;
    //removing from db
    this.htttpClientservice
      .delete({ controller: this.controller }, this.id)
      .subscribe({
        next: (data) => {
          //animation through removing the row (its parent node => th)
          $(td.parentElement).animate(
            { opacity: 0, left: '+=50', height: 'toogle' },
            700,
            () => {
              this.onDelete.emit();
              this.alertify.message(
                `${
                  this.controller == 'Roles' ? 'Role' : 'Product'
                } Successfully Deleted!`,
                {
                  dismissOthers: true,
                  messageType: MessageType.Success,
                  position: Position.TopRight,
                }
              );
            }
          );
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.alertify.message('An Error Occured. Please try again!', {
            dismissOthers: true,
            messageType: MessageType.Error,
            position: Position.TopRight,
          });
        },
      });
  }
}
