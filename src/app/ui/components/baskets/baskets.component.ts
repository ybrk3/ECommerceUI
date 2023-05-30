import { Component, OnInit } from '@angular/core';
import { List_Basket_Items } from 'src/contracts/basket/list_basket_items';
import { BasketService } from 'src/services/common/models/basket.service';

@Component({
  selector: 'app-baskets',
  templateUrl: './baskets.component.html',
  styleUrls: ['./baskets.component.css'],
})
export class BasketsComponent implements OnInit {
  basketItems: List_Basket_Items[];

  constructor(private basketService: BasketService) {}

  async ngOnInit() {
    this.basketItems = await this.basketService.getBasketItems();
    debugger;
  }

  private async getBasketItems() {
    console.log(this.basketItems);
  }
}
