import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

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
      .then(() => successCallBack())
      .catch((error) => errorCallBack(error));
  }

  //If we set page and/or size values as -1, it will return all roles
  //otherwise it will return roles as per pagination info
  async getRoles(
    page: number,
    size: number,
    successCallBack?: any,
    errorCallBack?: (error) => void
  ): Promise<any> {
    const observable: Observable<any> = this.httpClientService.get<any>({
      controller: this.controller,
      queryString: `page=${page}&size=${size}`,
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then((value) => successCallBack).catch(errorCallBack);
    return await promiseData;
  }
}
