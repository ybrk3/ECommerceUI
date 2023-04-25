import { Component, OnInit, ViewChild } from '@angular/core';
import { Create_Product } from 'src/contracts/create_product';
import { HttpClientService } from 'src/services/common/http-client.service';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  constructor(private httpClientService: HttpClientService) {}

  ngOnInit(): void {}

  @ViewChild(ListComponent) listComponents: ListComponent;
  createdProduct(create_Product: Create_Product) {
    this.listComponents.getProducts();
  }
}
