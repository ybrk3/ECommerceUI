import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { _isAuthenticated } from 'src/services/common/auth.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'src/services/ui/custom-toastr.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  //jwtHelper to reach token's info pls see canActivate method
  constructor(
    private jwtHelper: JwtHelperService,
    private router: Router,
    private toastrService: CustomToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    //In case of token is null or expired, _isAuthenticated parameter is set in authService
    if (!_isAuthenticated) {
      //It will route the page to login page and keep requested route as returnUrl
      this.router.navigate(['login'], {
        queryParams: { returnUrl: state.url },
      });

      //Warning message (spinner can be added)
      this.toastrService.message('Please login', 'Unauthorized', {
        messageType: ToastrMessageType.Warning,
        position: ToastrPosition.TopRight,
      });
    }
    return true;
  }
}
