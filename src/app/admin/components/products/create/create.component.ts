import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Create_Product } from 'src/contracts/create_product';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/services/admin/alertify.service';
import { ProductService } from 'src/services/common/models/product.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  frm: FormGroup;
  @Output() createdProduct: EventEmitter<Create_Product> =
    new EventEmitter<Create_Product>();

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

  ngOnInit(): void {}

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
