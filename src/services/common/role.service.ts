import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  controller: string = 'roles';
  constructor(private httpClientService: HttpClientService) {}

  async create(
    name: string,
    successCallBack?: () => void,
    errorCallBack?: (error) => void
  ): Promise<any> {
    const observable: Observable<any> = this.httpClientService.post(
      {
        controller: this.controller,
      },
      { name: name }
    );

    const promiseData = firstValueFrom(observable);
    promiseData
      .then((value) => successCallBack())
      .catch((error) => errorCallBack(error));
  }
}
