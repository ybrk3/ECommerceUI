import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderService } from 'src/services/ui/order.service';
import { Single_Order } from 'src/contracts/orders/single_order';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/services/admin/alertify.service';
import { DialogService } from 'src/services/common/dialog.service';
import { CompleteOrderDialogComponent } from '../complete-order-dialog/complete-order-dialog.component';
import { async } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-detail-dialog',
  templateUrl: './order-detail-dialog.component.html',
  styleUrls: ['./order-detail-dialog.component.css'],
})
export class OrderDetailDialogComponent
  extends BaseDialog<OrderDetailDialogComponent>
  implements OnInit
{
  displayedColumns: string[] = ['name', 'quantity', 'price', 'totalAmount'];
  singleOrder: Single_Order;
  totalPrice: number;
  dataSource = [];
  orderState: boolean = false;

  constructor(
    dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<string>,
    private orderService: OrderService,
    private alertify: AlertifyService,
    private dialogService: DialogService,
    private router: Router
  ) {
    super(dialogRef);
  }

  async ngOnInit() {
    this.singleOrder = await this.orderService.getOrderById(this.data);
    this.dataSource = this.singleOrder.basketItems;
    this.totalPrice = this.dataSource.reduce(
      (sum, bi) => sum + bi.price * bi.quantity,
      0
    );
  }
  completeOrder() {
    this.dialogService.openDialog({
      component: CompleteOrderDialogComponent,
      data: this.singleOrder.id,
      afterClosed: async () => {
        await this.orderService.completeOrder(this.singleOrder.id, () => {
          this.alertify.message('Order completed', {
            messageType: MessageType.Success,
            position: Position.TopCenter,
          });
        });
      }, //It will connect to the db to complete the order
    });
  }
}

export enum ShowOrderDetailState {
  Yes,
  No,
}
