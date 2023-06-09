import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { Create_User } from 'src/contracts/users/create_user';
import { User } from 'src/entities/user';
import { UserService } from 'src/services/common/models/user.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'src/services/ui/custom-toastr.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: CustomToastrService
  ) {
    this.registerForm = formBuilder.group(
      {
        nameSurname: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
        username: ['', [Validators.required, , Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
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

  ngOnInit(): void {}

  //to reach the control
  //also change "noPropertyAccessFromIndexSignature": false,
  get component() {
    return this.registerForm.controls;
  }
  async onSubmit(userData: User) {
    const result: Create_User = await this.userService.create(userData);
    if (result.succeeded)
      this.toastrService.message(result.message, 'Succesful', {
        messageType: ToastrMessageType.Succes,
        position: ToastrPosition.TopCenter,
      });
    else
      this.toastrService.message(result.message, 'Error', {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopCenter,
      });
  }
}
