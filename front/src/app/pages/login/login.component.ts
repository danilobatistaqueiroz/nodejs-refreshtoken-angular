import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { LoginService } from '../../services/login.service';
import { Login } from '../../models/login';
import { CookieService } from 'ngx-cookie-service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PasswordResetRequestComponent } from '../../modals/password-reset-request/password-reset-request.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup = this.fb.group(new Login('','','','','',false));
  errorMessage: string|null = null
  showTfa: boolean = false;
  tfaEnabled?:boolean;
  tfa:TFA = new TFA('','','','','');
  tfaForm:FormGroup = this.fb.group({authcode:''});

  closeResult = '';

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router, private cookie:CookieService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.loginForm.controls['email'].setValue('zorro@gmail.com');
    this.loginForm.controls['password'].setValue('11111111');
    this.loginForm.controls['email'].addValidators([Validators.email, Validators.required, Validators.minLength(7)]);
    this.loginForm.controls['password'].addValidators([Validators.required, Validators.minLength(8)]);
  }

  passwordReset(){
    let data = {
      email: this.loginForm.controls['email'].value
    }
    const modalRef = this.modalService.open(PasswordResetRequestComponent, 
      { backdrop: 'static', centered:true, keyboard: false, ariaLabelledBy: 'modal-basic-title' });
    modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
    modalRef.componentInstance.email = data.email;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  sendEmail() {
    if(!this.tfaEnabled){
      this.loginService.getTfaStatus(this.loginForm.controls['email'].value).subscribe({
        next: (data) => {
          this.tfaEnabled = (data.body as any).tfa;
          if(this.tfaEnabled){
            this.generateTfa();
          }
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = (err.error as any).message;
        },
        complete: () => {}
      });
    }
  }

  login(){
    if(this.tfaEnabled==undefined){
      this.sendEmail();
      return;
    }
    if(this.tfaEnabled){
      this.showTfa=true;
    } else {
      this.loginWithOnlyPassword();
    }
  }
  loginWithOnlyPassword() {
    this.loginService.loginAuth(this.loginForm.value,this.tfaForm.controls['authcode'].value).subscribe({
      next: (data) => {
        this.errorMessage = null;
        if(!data || !data.body)
          return;
        if (data.status === 200) {
          this.loginService.updateAuthStatus(true);
          this.router.navigateByUrl('/home');
        }
      },
      error: (err)=>{
        console.error(err);
        this.errorMessage = (err.error as any).message;
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

}


class TFA {
  constructor(public message:string, public tempSecret:string, public secret:string, public dataURL:string, public tfaURL:string){}
}