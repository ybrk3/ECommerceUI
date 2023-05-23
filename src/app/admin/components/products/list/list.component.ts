import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UploadPhotoDialogComponent } from 'src/app/dialogs/upload-photo-dialog/upload-photo-dialog.component';
import { List_Product } from 'src/contracts/list_product';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/services/admin/alertify.service';
import { DialogService } from 'src/services/common/dialog.service';
import { ProductService } from 'src/services/common/models/product.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'stock',
    'price',
    'createdDate',
    'updatedDate',
    'photo',
    'edit',
    'delete',
  ];
  dataSource: MatTableDataSource<List_Product> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  appDelete: any;

  constructor(
    private productService: ProductService,
    private alertify: AlertifyService,
    private dialogService: DialogService
  ) {}

  async ngOnInit() {
    await this.getProducts();
  }

  async getProducts() {
    const allProducts: { totalProductCount: number; products: List_Product[] } =
      await this.productService.read(
        this.paginator ? this.paginator.pageIndex : 0,
        this.paginator ? this.paginator.pageSize : 5,
        () => {},
        (errorMessage) => {
          this.alertify.message(errorMessage, {
            dismissOthers: true,
            messageType: MessageType.Error,
            position: Position.TopRight,
            delay: 10,
          });
        }
      );
    this.dataSource = new MatTableDataSource<List_Product>(
      allProducts.products
    );
    this.paginator.length = allProducts.totalProductCount;
  }

  async pageChanged() {
    await this.getProducts(); //page event
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
