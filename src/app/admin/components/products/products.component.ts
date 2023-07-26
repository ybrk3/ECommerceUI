import { Component, OnInit, ViewChild } from '@angular/core';

import { Create_Product } from 'src/contracts/create_product';
import { ListComponent } from './list/list.component';
import { DialogService } from 'src/services/common/dialog.service';
import { ScanQrCodeDialogComponent } from 'src/app/dialogs/scan-qr-code-dialog/scan-qr-code-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  textFilter: string = '';

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {}

  @ViewChild(ListComponent) listComponents: ListComponent;

  createdProduct(create_Product: Create_Product) {
    this.listComponents.getProducts();
  }
  showQRScanner() {
    this.dialogService.openDialog({
      component: ScanQrCodeDialogComponent,
      afterClosed: () => {},
    });
  }
}
