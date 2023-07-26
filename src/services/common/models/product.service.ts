import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Product } from 'src/contracts/create_product';
import { HttpErrorResponse } from '@angular/common/http';
import { List_Product } from 'src/contracts/list_product';
import { Observable, firstValueFrom } from 'rxjs';
import { List_Product_Images } from 'src/contracts/list_product_images';
import { ListResponseModel } from 'src/contracts/list_responseModel';

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
  ): Promise<{ totalProductCount: number; products: List_Product[] }> {
    const promiseData: Promise<{
      totalProductCount: number;
      products: List_Product[];
    }> = this.httpClientService
      .get<{ totalProductCount: number; products: List_Product[] }>({
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
  async getFilteredProducts(productName: string, page: number, size: number) {
    const observable: Observable<any> = this.httpClientService.get({
      controller: this.controller,
      action: 'get-filtered-products',
      queryString: `page=${page}&size=${size}&productName=${productName.toLocaleLowerCase()}`,
    });
    const promiseData = await firstValueFrom(observable);
    return promiseData;
  }

  async delete(id: string) {
    const deleteObservable: Observable<any> =
      this.httpClientService.delete<any>({ controller: this.controller }, id);

    await firstValueFrom(deleteObservable);
  }

  async getImages(id: string): Promise<List_Product_Images[]> {
    const getObservable: Observable<List_Product_Images[]> =
      this.httpClientService.get<List_Product_Images[]>(
        { action: 'getProductImages', controller: this.controller },
        id
      );
    const productImages = await firstValueFrom(getObservable);
    return productImages;
  }

  async deleteImage(id: string, imageId: string) {
    const getObservable = this.httpClientService.delete(
      {
        action: 'deleteImage',
        controller: this.controller,
        queryString: `imageId=${imageId}`,
      },
      id
    );
    await firstValueFrom(getObservable);
  }

  async changeShowcase(
    imageId: string,
    productId: string,
    successCallBack?: () => void
  ): Promise<void> {
    const observable = this.httpClientService.get({
      controller: this.controller,
      action: 'ChangeShowCase',
      queryString: `imageId=${imageId}&productId=${productId}`,
    });

    await firstValueFrom(observable);
    successCallBack();
  }

  async UpdateStockWithQRCode(
    productId: string,
    stock: number,
    successCallBack?: () => void
  ) {
    const observable = this.httpClientService.put(
      {
        controller: this.controller,
        action: 'qrcode',
      },

      { productId, stock }
    );
    await firstValueFrom(observable);
    successCallBack();
  }
}
