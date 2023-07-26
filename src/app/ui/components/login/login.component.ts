import {
  FacebookLoginProvider,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/services/common/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private socialAuthService: SocialAuthService
  ) {
    socialAuthService.authState.subscribe((user: SocialUser) => {
      switch (user?.provider) {
        case 'GOOGLE': {
          authService.googleLogin(user, () => {
            this.authService.identityCheck(); //to set _isAuthenticated and that value is being used in app.component
            this.navigateToReturnUrl('');
          });
          break;
        }
        case 'FACEBOOK': {
          authService.facebookLogin(user, () => {
            this.authService.identityCheck(); //to set _isAuthenticated and that value is being used in app.component
            this.navigateToReturnUrl('');
          });
          break;
        }
      }
    });
  }

  ngOnInit(): void {}

  async login(txtUsernameOrEmail: string, txtPassword: string) {
    await this.authService.login(
      {
        emailOrUsername: txtUsernameOrEmail,
        password: txtPassword,
      },
      () => {
        this.authService.identityCheck(); //to set _isAuthenticated and that value is being used in app.component
        this.navigateToReturnUrl('');
      }
    );
  }

  private navigateToReturnUrl(path: string) {
    //if there is returnUrl, below will navigate the route there
    this.activatedRoute.queryParams.subscribe((params) => {
      const returnUrl: string = params['returnUrl'];
      if (returnUrl) this.router.navigate([returnUrl]);
      else this.router.navigate([path]);
    });
  }

  async facebookLogin() {
    //Open facebook login window
    await this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
}
