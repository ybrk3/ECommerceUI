import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Product } from 'src/contracts/create_product';
import { AlertifyService } from 'src/services/admin/alertify.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClientService: HttpClientService) {}

  create(product: Create_Product, successCallBack?: any) {
    this.httpClientService
      .post({ controller: 'Products' }, product)
      .subscribe((result) => successCallBack());
  }
}
