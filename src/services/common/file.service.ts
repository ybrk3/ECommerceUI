import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  controller: string = 'file';

  constructor(private httpClientService: HttpClientService) {}

  async getBaseStorageUrl(): Promise<any> {
    const url: Observable<any> = this.httpClientService.get({
      controller: this.controller,
      action: 'GetBaseStorageUrl',
    });

    return await firstValueFrom(url);
  }
}
