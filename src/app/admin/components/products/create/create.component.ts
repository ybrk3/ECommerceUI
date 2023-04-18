import { Component, OnInit } from '@angular/core';
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
  constructor(
    private productService: ProductService,
    private alertify: AlertifyService
  ) {}

  ngOnInit(): void {}

  create(
    name: HTMLInputElement,
    stock: HTMLInputElement,
    price: HTMLInputElement
  ) {
    const create_Product: Create_Product = new Create_Product();
    create_Product.name = name.value;
    create_Product.stock = +stock.value;
    create_Product.price = +price.value;

    this.productService.create(
      create_Product,
      this.alertify.message('Product Added', {
        dismissOthers: true,
        messageType: MessageType.Success,
        position: Position.TopRight,
      })
    );
  }
}
