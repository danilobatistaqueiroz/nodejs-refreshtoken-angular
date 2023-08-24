import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginServiceService } from '../../services/login-service/login-service.service';
import { RegisterResponse } from '../../models/register.response';
import { Login } from '../../models/login';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  showToast = false;
  autohideToast = true;

  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private loginService: LoginServiceService, private router: Router) { }

  registerForm: FormGroup = this.fb.group(new Login('', '', '', '', false));

  ngOnInit() {
    this.registerForm.controls['email'].addValidators([Validators.email, Validators.required, Validators.minLength(7)]);
    this.registerForm.controls['password'].addValidators([Validators.required, Validators.minLength(8)]);
    this.registerForm.controls['tfa'].addValidators([Validators.required]);
    this.registerForm.controls['email'].setValue('bengue@gmail.com');
    this.registerForm.controls['password'].setValue('11111111');
    this.registerForm.controls['confirmpass'].setValue('11111111');
  }

  closeToast() {
    setTimeout(() => (this.showToast = false), 1500);
  }

  validateUserPassword(): boolean {
    let register = this.registerForm.value;
    return register.email && register.password && (register.password === register.confirmpass);
  }

  clearErrors() {
    this.registerForm.setErrors(null);
  }

  registerUser() {
    if (this.registerForm.invalid) {
      this.registerForm.setErrors({ ...this.registerForm.errors, 'registerErrors': true });
      return;
    }
    if (this.validateUserPassword()) {
      this.loginService.registerUser(this.registerForm.value).subscribe({
        next: (data) => {
          if (data == null || data.body == null)
            return;
          const result: RegisterResponse = (data.body as RegisterResponse)
          this.errorMessage = result.message;
          if (data.status === 200) {
            this.showToast = true;
          }
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.error.message;
        }
      });
    }
  }

}


