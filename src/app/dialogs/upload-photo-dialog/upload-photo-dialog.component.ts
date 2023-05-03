import { Component, Inject, OnInit, Output } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileUploadOptions } from 'src/services/common/file-upload/file-upload.component';
import { ProductService } from 'src/services/common/models/product.service';
import { List_Product_Images } from 'src/contracts/list_product_images';
import { DialogService } from 'src/services/common/dialog.service';
import {
  DeleteDialogComponent,
  DeleteState,
} from '../delete-dialog/delete-dialog.component';

declare var $: any;

@Component({
  selector: 'app-upload-photo-dialog',
  templateUrl: './upload-photo-dialog.component.html',
  styleUrls: ['./upload-photo-dialog.component.css'],
})
export class UploadPhotoDialogComponent
  extends BaseDialog<UploadPhotoDialogComponent>
  implements OnInit
{
  constructor(
    dialogRef: MatDialogRef<UploadPhotoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<UploadPhotoState> | string,
    private productService: ProductService,
    private dialog: DialogService
  ) {
    super(dialogRef);
  }

  @Output() options: Partial<FileUploadOptions> = {
    controller: 'Products',
    action: 'upload',
    explanation: 'Please drag or select product photos',
    isAdmin: true,
    accept: '.png,.jpeg,.jpg,.gif',
    queryString: `id=${this.data}`,
  };

  productImages: List_Product_Images[] = [];
  async ngOnInit() {
    this.productImages = await this.productService.getImages(
      this.data as string //converting to string
    );
  }

  async deleteImage(imageId: string, event: any) {
    this.dialog.openDialog({
      component: DeleteDialogComponent,
      data: DeleteState.Yes,
      afterClosed: async () => {
        await this.productService.deleteImage(this.data as string, imageId);
        var card = $(event.srcElement).parent().parent().parent();
        card.fadeOut(500);
      },
    });
  }
}

export enum UploadPhotoState {
  close,
}
