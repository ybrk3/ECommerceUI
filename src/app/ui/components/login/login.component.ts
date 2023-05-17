import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageType, Position } from 'src/services/admin/alertify.service';
import { AuthService } from 'src/services/common/auth.service';
import { UserService } from 'src/services/common/models/user.service';
import { CustomToastrService } from 'src/services/ui/custom-toastr.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async login(txtUsernameOrEmail: string, txtPassword: string) {
    await this.userService.login(
      {
        emailOrUsername: txtUsernameOrEmail,
        password: txtPassword,
      },
      () => {
        this.authService.identityCheck(); //to set _isAuthenticated and that value is being used in app.component
        this.activatedRoute.queryParams.subscribe((params) => {
          const returnUrl: string = params['returnUrl'];
          if (returnUrl) this.router.navigate([returnUrl]);
          else this.router.navigate(['']);
        });
      }
    );
  }
}
