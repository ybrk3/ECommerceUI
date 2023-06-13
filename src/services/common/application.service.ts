import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { Menu } from 'src/contracts/application_configs/menu';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  controller: string = 'ApplicationServices';

  constructor(private httpClientService: HttpClientService) {}

  async getAuthorizationDefinitionEndpoints(): Promise<Menu[]> {
    const observable: Observable<Menu[]> = this.httpClientService.get<Menu[]>({
      controller: this.controller,
    });
    return await firstValueFrom(observable);
  }
}
