import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordReset } from '../../models/password-reset';
import { PasswordResetService } from '../../services/password-reset.service';
import { GenericResponse } from '../../models/generic.response';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  order: string = '';
  token: string = '';
  userId: string = '';

  showToast = false;
  autohideToast = true;

  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private passwordResetService: PasswordResetService, private toastService: ToastService) { }

  resetForm!: FormGroup;

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '0';
    this.userId = this.route.snapshot.queryParamMap.get('userId') || '0';
    this.resetForm = this.fb.group(new PasswordReset(this.userId,this.token,'',''));
    this.resetForm.controls['password'].addValidators([Validators.required, Validators.minLength(8)]);
    this.resetForm.controls['confirmpass'].addValidators([Validators.required, Validators.minLength(8)]);
  }

  resetPassword(btReset:HTMLButtonElement) {
    if (this.resetForm.invalid) {
      this.resetForm.setErrors({ ...this.resetForm.errors, 'resetErrors': true });
      return;
    }
    if (this.validatePassword()) {
      btReset.disabled=true;
      this.passwordResetService.passwordReset(this.resetForm.value).subscribe({
        next: (data) => {
          btReset.disabled=false;
          if (data == null || data.body == null) {
            this.errorMessage = "Something's gone wrong!";
            return;
          }
          if (data.status === 200) {
            this.toastService.show("Your password has been changed successfully!", { classname: 'bg-success' , style: {'min-width':'280px'}});
            return;
          }
          const result: GenericResponse = (data.body as GenericResponse)
          this.errorMessage = result.message;
        },
        error: (err) => {
          btReset.disabled=false;
          console.error(err);
          this.errorMessage = err.error;
        }
      });
    }
  }

  validatePassword(): boolean {
    let reset = this.resetForm.value;
    return reset.password && (reset.password === reset.confirmpass);
  }

  clearErrors() {
    this.resetForm.setErrors(null);
  }

  closeToast() {
    setTimeout(() => (this.showToast = false), 1500);
  }

}
