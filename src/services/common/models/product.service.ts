import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Product } from 'src/contracts/create_product';
import { HttpErrorResponse } from '@angular/common/http';
import { List_Product } from 'src/contracts/list_product';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClientService: HttpClientService) {}
  controller: string = 'Products';

  create(
    product: Create_Product,
    successCallBack?: any,
    errorCallBack?: (errorMessage: string) => void
  ) {
    this.httpClientService
      .post({ controller: this.controller }, product)
      .subscribe({
        next: () => successCallBack(),
        error: (errorResponse: HttpErrorResponse) => {
          let message = '';
          const error: Array<{ key: string; value: Array<string> }> =
            errorResponse.error;
          error.forEach((v) =>
            v.value.forEach((_v) => (message += `${_v} <br>`))
          );
          errorCallBack(message);
        },
      });
  }

  async read(
    page: number,
    size: number,
    successCallBack?: any,
    errorCallBack?: (errorMessage: string) => void
  ): Promise<{ totalCount: number; products: List_Product[] }> {
    const promiseData: Promise<{
      totalCount: number;
      products: List_Product[];
    }> = this.httpClientService
      .get<{ totalCount: number; products: List_Product[] }>({
        controller: this.controller,
        queryString: `page=${page}&size=${size}`,
      })
      .toPromise();

    promiseData
      .then((s) => successCallBack())
      .catch((errorResponse: HttpErrorResponse) =>
        errorCallBack(errorResponse.message)
      );

    return await promiseData;
  }

  async delete(id: string) {
    const deleteObservable: Observable<any> =
      this.httpClientService.delete<any>({ controller: this.controller }, id);

    await firstValueFrom(deleteObservable);
  }
}
