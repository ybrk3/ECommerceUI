import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UploadPhotoDialogComponent } from 'src/app/dialogs/upload-photo-dialog/upload-photo-dialog.component';
import { List_Product } from 'src/contracts/list_product';
import { ListOrders } from 'src/contracts/orders/list_orders';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/services/admin/alertify.service';
import { DialogService } from 'src/services/common/dialog.service';
import { ProductService } from 'src/services/common/models/product.service';
import { OrderService } from 'src/services/ui/order.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = [
    'orderCode',
    'nameSurname',
    'totalPrice',
    'createdDate',
  ];
  dataSource: MatTableDataSource<ListOrders> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  appDelete: any;

  constructor(
    private orderService: OrderService,
    private alertify: AlertifyService,
    private dialogService: DialogService
  ) {}

  async ngOnInit() {
    await this.getOrders();
  }

  async getOrders() {
    const allOrders: { totalOrderCount: number; orders: ListOrders[] } =
      await this.orderService.getOrders(
        this.paginator ? this.paginator.pageIndex : 0,
        this.paginator ? this.paginator.pageSize : 5,
        () => {},
        (errorMessage) =>
          this.alertify.message(errorMessage, {
            dismissOthers: true,
            messageType: MessageType.Error,
            position: Position.TopRight,
            delay: 10,
          })
      );
    this.dataSource = new MatTableDataSource<ListOrders>(allOrders.orders);
    this.paginator.length = allOrders.totalOrderCount;
  }

  async pageChanged() {
    await this.getOrders(); //page event
  }
  onPhotoUpload(id: string) {
    this.dialogService.openDialog({
      component: UploadPhotoDialogComponent,
      data: id,
      options: {
        width: '1250px',
      },
    });
  }
}
