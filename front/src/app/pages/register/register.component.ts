import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { GenericResponse } from '../../models/generic.response';
import { Login } from '../../models/login';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router, private toastService: ToastService) { }

  registerForm: FormGroup = this.fb.group(new Login('', '', '', '', '', false));

  ngOnInit() {
    this.registerForm.controls['name'].addValidators([Validators.required, Validators.minLength(3), Validators.maxLength(8)]);
    this.registerForm.controls['email'].addValidators([Validators.email, Validators.required, Validators.minLength(7)]);
    this.registerForm.controls['password'].addValidators([Validators.required, Validators.minLength(8)]);
    this.registerForm.controls['tfa'].addValidators([Validators.required]);
    this.registerForm.controls['name'].setValue('zorro');
    this.registerForm.controls['email'].setValue('zorro@gmail.com');
    this.registerForm.controls['password'].setValue('11111111');
    this.registerForm.controls['confirmpass'].setValue('11111111');
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
          const result: GenericResponse = (data.body as GenericResponse)
          this.errorMessage = result.message;
          if (data.status === 200) {
             this.toastService.show("You need to confirm your account, got to your email box.", { classname: 'bg-success' });
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


