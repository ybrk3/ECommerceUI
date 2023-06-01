import { Component, OnInit } from '@angular/core';
import { List_Basket_Items } from 'src/contracts/basket/list_basket_items';
import { BasketService } from 'src/services/common/models/basket.service';
import { UiModule } from '../../ui.module';
import { ToastrService } from 'ngx-toastr';
import {
  CustomToastrService,
  ToastrMessageType,
} from 'src/services/ui/custom-toastr.service';
import { Update_Quantity } from 'src/contracts/basket/update_quantity';

declare var $: any;

@Component({
  selector: 'app-baskets',
  templateUrl: './baskets.component.html',
  styleUrls: ['./baskets.component.css'],
})
export class BasketsComponent implements OnInit {
  basketItems: List_Basket_Items[];
  sumPrice: number;

  constructor(
    private toastrService: CustomToastrService,
    private basketService: BasketService
  ) {}

  async ngOnInit(): Promise<void> {
    this.basketItems = await this.basketService.getBasketItems();
    this.sumPrice = this.basketItems.reduce((sum, bi) => sum + bi.price, 0);
    console.log(this.basketItems[0]);
  }
  removeBasketItem(basketItemId: string) {
    debugger;
    this.basketService.removeItemFromBasket(basketItemId);

    $('.' + basketItemId).fadeOut(500, () => {});
  }
  changedQuantity(object: any) {
    const basketItemId = object.target.attributes['id'].value; //data-id in .html
    const quantity = object.target.value;
    const updatedQuantity: Update_Quantity = new Update_Quantity();
    updatedQuantity.basketItemId = basketItemId;
    updatedQuantity.quantity = quantity;
    this.basketService.updateQuantity(updatedQuantity);
  }
}
