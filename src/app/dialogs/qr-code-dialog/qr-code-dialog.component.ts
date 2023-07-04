import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QrCodeService } from 'src/services/common/qr-code.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-qr-code-dialog',
  templateUrl: './qr-code-dialog.component.html',
})
export class QrcodeDialogComponent
  extends BaseDialog<QrcodeDialogComponent>
  implements OnInit
{
  constructor(
    dialogRef: MatDialogRef<QrcodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private qrCodeService: QrCodeService,
    private domSanitizer: DomSanitizer
  ) {
    super(dialogRef);
  }

  qrCodeSafeUrl: SafeUrl;

  async ngOnInit() {
    const qrCodeBlob: Blob = await this.qrCodeService.getQRCode(this.data);
    const url: string = URL.createObjectURL(qrCodeBlob);
    this.qrCodeSafeUrl = this.domSanitizer.bypassSecurityTrustUrl(url);
  }
}
