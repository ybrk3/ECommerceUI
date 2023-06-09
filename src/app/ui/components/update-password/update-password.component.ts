import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/services/admin/alertify.service';
import { AuthService } from 'src/services/common/auth.service';
import { UserService } from 'src/services/common/models/user.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css'],
})
export class UpdatePasswordComponent implements OnInit {
  updatePasswordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private alertify: AlertifyService,
    private router: Router
  ) {
    this.updatePasswordForm = formBuilder.group(
      {
        password: [
          'Password',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
            ),
          ],
        ],
        passwordConfirm: ['', [Validators.required]],
      },
      {
        validator: (group: AbstractControl): ValidationErrors | null => {
          let password = group.get('password').value;
          let confirmPassword = group.get('confirmPassword').value;
          return password === confirmPassword ? null : { notSame: true };
        },
      }
    );
  }

  state: any;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: async (params) => {
        const userId: string = params['userId'];
        const resetToken: string = params['resetToken'];
        this.state = await this.authService.verifyResetToken(
          resetToken,
          userId
        );
      }, //state.state will be true or false. if true it will render reset password page and used in html under -ngIf
    });
  }

  updatePassword(newPassword: string, confirmNewPassword: string) {
    this.activatedRoute.params.subscribe({
      next: async (params) => {
        const userId: string = params['userId'];
        const resetToken: string = params['resetToken'];
        await this.userService.UpdatePassword(
          userId,
          resetToken,
          this.updatePasswordForm.controls['password'].value,
          this.updatePasswordForm.controls['passwordConfirm'].value,
          () => {
            this.alertify.message('Password reset!', {
              messageType: MessageType.Success,
              position: Position.TopRight,
            });

            //If success, route to login page
            this.router.navigate(['/login']);
          },
          (error) =>
            this.alertify.message(error, {
              messageType: MessageType.Error,
              position: Position.TopCenter,
            })
        );
      },
    });
  }
}
