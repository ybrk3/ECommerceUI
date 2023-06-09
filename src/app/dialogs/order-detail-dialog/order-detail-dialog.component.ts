import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { OrderService } from 'src/services/ui/order.service';
import { Single_Order } from 'src/contracts/orders/single_order';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/services/admin/alertify.service';

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

  constructor(
    dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<string>,
    private orderService: OrderService,
    private alertify: AlertifyService
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
}

export enum ShowOrderDetailState {
  Yes,
  No,
}
