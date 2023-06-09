import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { User } from 'src/entities/user';
import { Create_User } from 'src/contracts/users/create_user';
import { Observable, firstValueFrom } from 'rxjs';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ProductsModule } from 'src/app/admin/components/products/products.module';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClientService: HttpClientService) {}
  controller: string = 'users';

  /* body to be sent is in type of User
  However, response to be in type of Create_User
  That's way we gave two optional parameter type to post<..> */

  async create(user: User): Promise<Create_User> {
    const observable: Observable<Create_User | User> =
      this.httpClientService.post<Create_User | User>(
        { controller: this.controller },
        user
      );
    return (await firstValueFrom(observable)) as Create_User;
    /*It'll return data in type Create_User that's way we set return type as Promise<Create_User>
    And also "as Create_User* give consistency as return type to be Create_User*/
  }

  async UpdatePassword(
    userId: string,
    resetToken: string,
    newPassword: string,
    confirmNewPassword: string,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage) => void
  ) {
    const observable: Observable<any> = await this.httpClientService.post(
      {
        controller: this.controller,
        action: 'update-password',
      },
      {
        userId: userId,
        resetToken: resetToken,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
      }
    );

    const promiseData: Promise<any> = firstValueFrom(observable);
    promiseData
      .then((value) => successCallBack())
      .catch((error) => errorCallBack(error));

    await promiseData;
  }
}
