import { Injectable } from '@angular/core';
import { HttpClientService } from '../common/http-client.service';
import { Create_Order } from 'src/contracts/basket/create_order';
import { Observable, firstValueFrom } from 'rxjs';
import { ListOrders } from 'src/contracts/orders/list_orders';
import { Single_Order } from 'src/contracts/orders/single_order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  controller: string = 'orders';
  constructor(private httpClientService: HttpClientService) {}

  async createOrder(
    order: Create_Order,
    successCallBack?: () => void
  ): Promise<any> {
    const response: Observable<any> = this.httpClientService.post(
      {
        controller: this.controller,
      },
      order
    );

    await firstValueFrom(response);
    successCallBack();
  }

  async getOrders(
    page: number,
    size: number,
    successCallBack?: any,
    errorCallBack?: (errorMessage: string) => void
  ): Promise<{ totalOrderCount: number; orders: ListOrders[] }> {
    const response: Observable<{
      totalOrderCount: number;
      orders: ListOrders[];
    }> = await this.httpClientService.get<{
      totalOrderCount: number;
      orders: ListOrders[];
    }>({
      controller: this.controller,
      queryString: `page=${page}&size=${size}`,
    });
    const promiseData = firstValueFrom(response);
    promiseData
      .then((value) => successCallBack())
      .catch((error) => errorCallBack(error));
    return await promiseData;
  }

  async getOrderById(
    orderId: string,
    successCallBack?: any,
    errorCallBack?: (errorMessage: string) => void
  ): Promise<Single_Order> {
    const apiResponse: Observable<Single_Order> =
      await this.httpClientService.get<Single_Order>(
        {
          controller: this.controller,
        },
        orderId
      );
    const promiseData = firstValueFrom(apiResponse);
    promiseData
      .then((value) => successCallBack())
      .catch((error) => errorCallBack(error));

    return await promiseData;
  }

  async completeOrder(
    orderId: string,
    successCallBack?: any,
    errorCallBack?: (errorMessage: string) => void
  ) {
    const observable: Observable<any> = await this.httpClientService.get(
      {
        controller: this.controller,
        action: 'complete-order',
      },
      orderId
    );

    const promiseData = firstValueFrom(observable);
    promiseData
      .then((value) => successCallBack())
      .catch((error) => errorCallBack(error));
  }
}
