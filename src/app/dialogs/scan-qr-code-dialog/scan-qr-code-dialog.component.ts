import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QrCodeService } from 'src/services/common/qr-code.service';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { ProductService } from 'src/services/common/models/product.service';
import { ToastrService } from 'ngx-toastr';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'src/services/ui/custom-toastr.service';

declare var $: any;

@Component({
  selector: 'app-scan-qr-code-dialog',
  templateUrl: './scan-qr-code-dialog.component.html',
  styleUrls: ['./scan-qr-code-dialog.component.css'],
})
export class ScanQrCodeDialogComponent
  extends BaseDialog<ScanQrCodeDialogComponent>
  implements OnInit, OnDestroy
{
  constructor(
    dialogRef: MatDialogRef<ScanQrCodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private qrCodeService: QrCodeService,
    private productservice: ProductService,
    private toastrService: CustomToastrService
  ) {
    super(dialogRef);
  }

  @ViewChild('scanner', { static: true }) scanner: NgxScannerQrcodeComponent;

  @ViewChild('txtStock', { static: true }) stock: ElementRef;

  ngOnInit(): void {
    this.scanner.start();
  }
  ngOnDestroy(): void {
    this.scanner.stop();
  }
  async onScan(e) {
    //Scanned Data

    const data = e[0].value;
    //Eventhough QR Code seems as scanned, it could be null with empty data so we need to check it
    if (data != null && data != '') {
      const jsonData = JSON.parse(data);
      const stockValue = (this.stock.nativeElement as HTMLInputElement).value;
      this.scanner.stop();
      await this.productservice.UpdateStockWithQRCode(
        jsonData.Id,
        parseInt(stockValue),
        () => {
          console.log(e);

          $('#btnClose').click(); //Close the dialog window

          this.toastrService.message(
            `Stock value of product "${jsonData.Name}" has been successfully updated as "${jsonData.Stock}" pcs.`,
            'Stock Value Successfully Updated',
            {
              messageType: ToastrMessageType.Succes,
              position: ToastrPosition.TopFullWidth,
            }
          );
        }
      );
    }
  }
}
