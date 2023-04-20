import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Product } from 'src/contracts/create_product';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClientService: HttpClientService) {}

  create(product: Create_Product, successCallBack?: any, errorCallBack?: any) {
    this.httpClientService.post({ controller: 'Products' }, product).subscribe(
      (result) => successCallBack(),
      (errorResponse: HttpErrorResponse) => {
        let message = '';
        const error: Array<{ key: string; value: Array<string> }> =
          errorResponse.error;
        error.forEach((v) =>
          v.value.forEach((_v) => (message += `${_v} <br>`))
        );
        errorCallBack(message);
      }
    );
  }
}
