import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QrCodeService {
  constructor(private httpClientService: HttpClientService) {}

  //We get the QR Code as a File from API, so we get it as a Blob
  async getQRCode(productId: string) {
    const observable: Observable<Blob> = this.httpClientService.get(
      {
        controller: 'products',
        action: 'qrcode',
        responseType: 'blob', //it defines that File will be returned value
      },
      productId
    );
    return await firstValueFrom(observable);
  }
}
