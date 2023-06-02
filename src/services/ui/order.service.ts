import { Injectable } from '@angular/core';
import { HttpClientService } from '../common/http-client.service';
import { Create_Order } from 'src/contracts/basket/create_order';
import { Observable, firstValueFrom } from 'rxjs';

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
}
