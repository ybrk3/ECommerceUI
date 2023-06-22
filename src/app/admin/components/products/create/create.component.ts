import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Create_Product } from 'src/contracts/create_product';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/services/admin/alertify.service';
import { FileUploadOptions } from 'src/services/common/file-upload/file-upload.component';
import { ProductService } from 'src/services/common/models/product.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent {
  frm: FormGroup;

  //Event to refresh the product list
  @Output() createdProduct: EventEmitter<Create_Product> = new EventEmitter();
  //Options for uploading files of product. Due to it's used in file-upload component it's output
  @Output() fileUploadOptions: Partial<FileUploadOptions> = {
    controller: 'Products',
    action: 'upload',
    explanation: 'Please upload the photos belongs to product',
    isAdmin: true,
    accept: '.png,.jpeg,.jpg',
  };

  constructor(
    private productService: ProductService,
    private alertify: AlertifyService,
    private formBuilder: FormBuilder
  ) {
    this.frm = formBuilder.group({
      productName: ['', [Validators.required]],
      stock: ['', [Validators.required, Validators.min(0)]],
      price: ['', [Validators.required, Validators.min(0)]],
    });
  }

  create() {
    let create_Product: Create_Product = new Create_Product();
    create_Product.name = this.frm.value.productName;
    create_Product.stock = this.frm.value.stock;
    create_Product.price = this.frm.value.price;

    this.productService.create(
      create_Product,
      () => {
        this.alertify.message('Product Added', {
          dismissOthers: true,
          messageType: MessageType.Success,
          position: Position.TopRight,
        });
        this.createdProduct.emit();
        this.frm.reset();
      },
      (errorMessage) => {
        this.alertify.message(errorMessage, {
          dismissOthers: true,
          messageType: MessageType.Error,
          position: Position.TopRight,
          delay: 10,
        });
      }
    );
  }
}
