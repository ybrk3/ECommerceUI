import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from '../ui/custom-toastr.service';
import { MessageType } from '../admin/alertify.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor {
  constructor(
    private toastrService: CustomToastrService,
    private authService: AuthService,
    private router: Router
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        switch (error.status) {
          case HttpStatusCode.Unauthorized:
            this.authService
              .refreshTokenLogin(
                localStorage.getItem('refreshToken'),
                (state) => {
                  if (!state) {
                    const url: string = this.router.url;
                    if (url === '/products') {
                      this.toastrService.message(
                        'Please login to add products to cart',
                        'Please Login',
                        {
                          messageType: ToastrMessageType.Info,
                          position: ToastrPosition.TopCenter,
                        }
                      );
                      this.router.navigate(['/login']);
                    } else {
                      this.toastrService.message(
                        'You are not authorized!',
                        'Unauthorized',
                        {
                          messageType: ToastrMessageType.Warning,
                          position: ToastrPosition.TopFullWidth,
                        }
                      );
                      this.router.navigate(['/login']);
                    }
                  }
                }
              )
              .then((data) => {
                this.toastrService.message(
                  'You are not authorized!',
                  'Unauthorized',
                  {
                    messageType: ToastrMessageType.Warning,
                    position: ToastrPosition.TopFullWidth,
                  }
                );
              });
            break;
          case HttpStatusCode.InternalServerError:
            if (!HttpStatusCode.Unauthorized)
              this.toastrService.message(
                'Server unreachable',
                'Server Error!',
                {
                  messageType: ToastrMessageType.Warning,
                  position: ToastrPosition.TopFullWidth,
                }
              );

            break;
          case HttpStatusCode.BadRequest:
            this.toastrService.message('Invalid Request', 'Invalid Request!', {
              messageType: ToastrMessageType.Warning,
              position: ToastrPosition.TopFullWidth,
            });
            break;
          case HttpStatusCode.NotFound:
            this.toastrService.message('Page not found', 'Page Not Found!', {
              messageType: ToastrMessageType.Warning,
              position: ToastrPosition.TopFullWidth,
            });
            break;
          default:
            this.toastrService.message(
              'Unexpected Error. Please try again later',
              'Unexpected Error!',
              {
                messageType: ToastrMessageType.Warning,
                position: ToastrPosition.TopFullWidth,
              }
            );
            break;
        }
        return of(error);
      })
    );
  }
}
