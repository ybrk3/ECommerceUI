import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { User } from 'src/entities/user';
import { Create_User } from 'src/contracts/users/create_user';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { UserLogin } from 'src/entities/userLogin';
import { TokenResponse } from 'src/contracts/token/tokenResponse';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'src/services/ui/custom-toastr.service';
import { MessageType, Position } from 'src/services/admin/alertify.service';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private httpClientService: HttpClientService,
    private toastrService: CustomToastrService
  ) {}
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

  async login(userLogin: UserLogin, callBack?: () => any): Promise<void> {
    const observable: Observable<UserLogin | TokenResponse> =
      this.httpClientService.post<any | TokenResponse>(
        {
          controller: this.controller,
          action: 'login',
        },
        userLogin
      );
    const tokenResponse: TokenResponse = (await firstValueFrom(
      observable
    )) as TokenResponse; //It will return jwt

    //If it's successful, set the access token to local storage and return message
    if (tokenResponse) {
      localStorage.setItem('accessToken', tokenResponse.token.accessToken);

      this.toastrService.message('You logged in successfully', 'Logged In!', {
        messageType: ToastrMessageType.Succes,
        position: ToastrPosition.TopRight,
      });
      callBack();
    } else {
      this.toastrService.message('You are not authorized', 'Unauthorized', {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopCenter,
      });
    }
  }

  async googleLogin(user: SocialUser, callBack?: () => any) {
    const observable: Observable<SocialUser | TokenResponse> =
      this.httpClientService.post<SocialUser | TokenResponse>(
        {
          action: 'google-login',
          controller: this.controller,
        },
        user
      );

    const tokenResponse: TokenResponse = (await firstValueFrom(
      observable
    )) as TokenResponse;

    if (tokenResponse) {
      localStorage.setItem('accessToken', tokenResponse.token.accessToken);

      this.toastrService.message('You logged in successfully', 'Logged In!', {
        messageType: ToastrMessageType.Succes,
        position: ToastrPosition.TopRight,
      });
      callBack();
    } else {
      this.toastrService.message('You are not authorized', 'Unauthorized', {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopCenter,
      });
    }
  }
}
