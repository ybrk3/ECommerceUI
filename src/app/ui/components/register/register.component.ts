import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { PasswordStrengthValidator } from 'src/Validators/PasswordStrengthValidator';
import { User } from 'src/entities/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.registerForm = formBuilder.group(
      {
        name: [
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
            ,
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
  onSubmit(formData: User) {
    console.log(formData);
  }
}
