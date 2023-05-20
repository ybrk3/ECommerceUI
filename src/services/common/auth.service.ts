import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClientService } from './http-client.service';
import { UserLogin } from 'src/entities/userLogin';
import { Observable, firstValueFrom } from 'rxjs';
import { TokenResponse } from 'src/contracts/token/tokenResponse';
import { SocialUser } from '@abacritt/angularx-social-login';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from '../ui/custom-toastr.service';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
//Serivce to be responsible getting and sending jwt
export class AuthService {
  controller: string = 'Auth';
  constructor(
    private jwtHelper: JwtHelperService,
    private httpClientService: HttpClientService,
    private toastrService: CustomToastrService
  ) {}

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
    //As per token existency, notifying user
    if (tokenResponse) {
      this.successToastrNotification(tokenResponse);
      callBack();
    } else {
      this.errorToastrNotification(tokenResponse);
    }
  }

  async refreshTokenLogin(refreshToken: string): Promise<any> {
    const observable: Observable<any | TokenResponse> =
      this.httpClientService.post<any | TokenResponse>(
        {
          controller: this.controller,
          action: 'RefreshTokenLogin',
        },
        { refreshToken: refreshToken }
      );

    const tokenResponse: TokenResponse = (await firstValueFrom(
      observable
    )) as TokenResponse;
    if (tokenResponse) this.setToken(tokenResponse);
  }

  async googleLogin(user: SocialUser, callBack?: () => any): Promise<any> {
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

    //As per token existency, notifying user
    if (tokenResponse) {
      this.successToastrNotification(tokenResponse);
      callBack();
    } else {
      this.errorToastrNotification(tokenResponse);
    }
  }

  async facebookLogin(user: SocialUser, callBack?: () => any): Promise<any> {
    //there are 2 different parameters below, so one for type we sent back to API and other is response
    const observable: Observable<SocialUser | TokenResponse> =
      this.httpClientService.post<SocialUser | TokenResponse>(
        {
          controller: this.controller,
          action: 'facebook-login', //=> ../users/facebook-login
        },
        user
      );
    //get token. Due to above there are 2 different type we set it as "TokenResponse"
    const tokenResponse: TokenResponse = (await firstValueFrom(
      observable
    )) as TokenResponse;

    //As per token existency, notifying user
    if (tokenResponse) {
      this.successToastrNotification(tokenResponse);
      callBack();
    } else {
      this.errorToastrNotification(tokenResponse);
    }
  }

  private successToastrNotification(tokenResponse: TokenResponse) {
    this.setToken(tokenResponse);

    this.toastrService.message('You logged in successfully', 'Logged In!', {
      messageType: ToastrMessageType.Succes,
      position: ToastrPosition.TopRight,
    });
  }
  private errorToastrNotification(tokenResponse: TokenResponse) {
    this.setToken(tokenResponse);

    this.toastrService.message('You logged in successfully', 'Logged In!', {
      messageType: ToastrMessageType.Succes,
      position: ToastrPosition.TopRight,
    });
  }

  private setToken(tokenResponse: TokenResponse) {
    localStorage.setItem('accessToken', tokenResponse.token.accessToken);
    localStorage.setItem('refreshToken', tokenResponse.token.refreshToken);
  }
  identityCheck() {
    //Get token from localStorage
    const token: string = localStorage.getItem('accessToken');

    //Decode the token and recieve infor of Audience, Issuer etc. Except for SecurityKey
    //const decodedToken = this.jwtHelper.decodeToken(token);

    //Get token's expiration time
    //const expirationDate: Date = this.jwtHelper.getTokenExpirationDate(token);

    //If token is not valid, app will throw exception so set code in try-catch
    let isExpired: boolean;
    try {
      //Check whether token is expired or not
      isExpired = this.jwtHelper.isTokenExpired(token);
    } catch {
      isExpired = true;
    }
    //if token exists and not expired, it is to be true
    _isAuthenticated = token != null && !isExpired;
  }

  //to be used .html globally
  get isAuthenticated() {
    return _isAuthenticated;
  }
}
export let _isAuthenticated: boolean;
