import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
//Serivce to be responsible getting and sending jwt
export class AuthService {
  constructor(private jwtHelper: JwtHelperService) {}

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
