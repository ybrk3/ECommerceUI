import { Component, OnInit, ViewChild } from '@angular/core';
import { List_Basket_Items } from 'src/contracts/basket/list_basket_items';
import { BasketService } from 'src/services/common/models/basket.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'src/services/ui/custom-toastr.service';
import { Update_Quantity } from 'src/contracts/basket/update_quantity';
import { Create_Order } from 'src/contracts/basket/create_order';
import { OrderService } from 'src/services/ui/order.service';
import { DialogService } from 'src/services/common/dialog.service';
import {
  BasketItemDeleteState,
  BasketItemRemoveDialogComponent,
} from 'src/app/dialogs/basket-item-remove-dialog/basket-item-remove-dialog.component';
import {
  ShoppingCompleteDeleteState,
  ShoppingCompleteDialogComponent,
} from 'src/app/dialogs/shopping-complete-dialog/shopping-complete-dialog.component';
import { FileService } from 'src/services/common/file.service';

declare var $: any;

@Component({
  selector: 'app-baskets',
  templateUrl: './baskets.component.html',
  styleUrls: ['./baskets.component.css'],
})
export class BasketsComponent implements OnInit {
  basketItems: List_Basket_Items[];
  sumPrice: number;
  baseStorageUrl: string;
  state: boolean = false;

  constructor(
    private toastrService: CustomToastrService,
    private basketService: BasketService,
    private orderService: OrderService,
    private dialogService: DialogService,
    private fileService: FileService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getBasketItems();
  }

  removeBasketItem(basketItemId: string) {
    $('#basketModal').modal('hide');
    this.dialogService.openDialog({
      component: BasketItemRemoveDialogComponent,
      data: BasketItemDeleteState.Yes,
      afterClosed: async () => {
        await this.basketService.removeItemFromBasket(basketItemId);
        var a = $('.' + basketItemId);
        $('.' + basketItemId).fadeOut(500, () => {});
        this.getBasketItems();
        $('#basketModal').modal('show');
      },
    });
  }

  changedQuantity(object: any) {
    const basketItemId = object.target.attributes['id'].value; //data-id in .html
    const quantity = object.target.value;
    const updatedQuantity: Update_Quantity = new Update_Quantity();
    updatedQuantity.basketItemId = basketItemId;
    updatedQuantity.quantity = quantity;
    this.basketService.updateQuantity(updatedQuantity);
    this.getBasketItems();
  }

  async getBasketItems() {
    const basketItemsFromApi: List_Basket_Items[] =
      await this.basketService.getBasketItems();
    this.basketItems = basketItemsFromApi.map<List_Basket_Items>((bi) => {
      const basketItem: List_Basket_Items = {
        basketItemId: bi.basketItemId,
        name: bi.name,
        price: bi.price,
        quantity: bi.quantity,
        productId: bi.productId,
        image: bi.imagePaths.length ? bi.imagePaths.at(0) : '',
      };
      return basketItem;
    });
    this.baseStorageUrl = await this.fileService.getBaseStorageUrl();
    this.state = this.basketItems.length ? true : false;
    this.sumPrice = this.basketItems.reduce(
      (sum, bi) => sum + bi.price * bi.quantity,
      0
    );
  }

  async onShoppingComplete() {
    $('#basketModal').modal('hide');
    this.dialogService.openDialog({
      component: ShoppingCompleteDialogComponent,
      data: ShoppingCompleteDeleteState.Yes, //to be used callback function when click to Yes
      afterClosed: async () => {
        const newOrderInfo: Create_Order = new Create_Order();
        newOrderInfo.address = 'Emek/Çankaya/Ankara';
        newOrderInfo.description = '....';
        await this.orderService.createOrder(newOrderInfo, () =>
          this.toastrService.message(
            'Order successfully completed!',
            'Order Done!',
            {
              messageType: ToastrMessageType.Succes,
              position: ToastrPosition.TopCenter,
            }
          )
        );
        this.getBasketItems();
      },
    });
  }
}
