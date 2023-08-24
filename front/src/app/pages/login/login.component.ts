import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router'
import { LoginServiceService } from '../../services/login-service/login-service.service';
import { Login } from '../../models/login';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup = this.fb.group(new Login('','','','',false));
  errorMessage: string|null = null
  showTfa: boolean = false;
  tfaEnabled:boolean = false;
  tfa:TFA = new TFA('','','','','');
  tfaForm:FormGroup = this.fb.group({authcode:''});

  constructor(private fb: FormBuilder, private loginService: LoginServiceService, private router: Router, private cookie:CookieService) {
  }

  ngOnInit() {
    this.loginForm.controls['email'].setValue('bengue@gmail.com');
    this.loginForm.controls['password'].setValue('11111111');
  }

  sendEmail() {
    this.loginService.getTfaStatus(this.loginForm.controls['email'].value).subscribe({
      next: (data) => {
        this.tfaEnabled = (data.body as any).tfa;
        if(this.tfaEnabled){
          this.generateTfa();
        }
      },
      error: (err) => {},
      complete: () => {}
    });
  }

  login(){
    if(this.tfaEnabled){
      this.showTfa=true;
    } else {
      this.loginWithOnlyPassword();
    }
  }
  loginWithOnlyPassword() {
    this.loginService.loginAuth(this.loginForm.value).subscribe({
      next: (data) => {
        this.errorMessage = null;
        if(!data || !data.body)
          return;
        if (data.status === 200) {
          if((data.body as any).tfa) {
            this.verifyTfa();
          } else {
            this.loginService.updateAuthStatus(true);
            this.router.navigateByUrl('/home');
          }
        }
      },
      error: (err)=>{
        console.error(err);
        if (err.status === 403) {
          this.errorMessage = (err.error as any).message;
        }
        if (err.status === 404) {
          this.errorMessage = (err.error as any).message;
        }
      },
      complete: ()=>{
        
      }
    });
  }

  generateTfa() {
    this.loginService.generateTfa(this.loginForm.controls['email'].value).subscribe((data) => {
      const result = data.body;
      if (data['status'] === 200) {
        this.tfa = (result as TFA);
      }
    });
  }

  verifyTfa() {
    this.loginService.verifyTfa(this.tfaForm.value).subscribe({
      next: (data) => {
        const result = data.body;
        if (data.status === 200) {
          this.errorMessage = null;
          this.loginService.tfa.secret = this.tfa.tempSecret;
          this.loginService.tfa.dataURL = this.tfa.dataURL;
          this.tfa.tempSecret = "";
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = (result as any).error.message;
        }
      },
      error:(err)=>{
        console.error(err);
        this.errorMessage = (err as any).error.message;
      },
      complete:()=>{}
    });
  }

}


class TFA {
  constructor(public message:string, public tempSecret:string, public secret:string, public dataURL:string, public tfaURL:string){}
}