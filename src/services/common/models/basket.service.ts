import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { List_Basket_Items } from 'src/contracts/basket/list_basket_items';
import { Add_Basket_Item } from 'src/contracts/basket/add_basket_item';
import { Update_Quantity } from 'src/contracts/basket/update_quantity';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  controller: string = 'baskets';
  constructor(private httpClientService: HttpClientService) {}

  async getBasketItems(): Promise<List_Basket_Items[]> {
    const response: Observable<List_Basket_Items[]> =
      this.httpClientService.get<List_Basket_Items[]>({
        controller: this.controller,
      });
    return await firstValueFrom(response);
  }

  async AddItemToBasket(
    basketItem: Add_Basket_Item,
    successCallBack?: () => void
  ): Promise<any> {
    const observable: Observable<any> = this.httpClientService.post(
      { controller: this.controller },
      basketItem
    );
    await firstValueFrom(observable);
    successCallBack();
  }

  async removeItemFromBasket(basketItemId: string): Promise<any> {
    const observable: Observable<any> = this.httpClientService.delete(
      { controller: this.controller },
      basketItemId
    );

    await firstValueFrom(observable);
  }

  async updateQuantity(updateQuantity: Update_Quantity) {
    const observable = this.httpClientService.put(
      { controller: this.controller },
      updateQuantity
    );

    await firstValueFrom(observable);
  }
}
