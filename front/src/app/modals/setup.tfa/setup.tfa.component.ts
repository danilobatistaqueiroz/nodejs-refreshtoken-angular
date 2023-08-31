import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { CookieService } from 'ngx-cookie-service';
import { Login } from '../../models/login';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/services/toast.service';


@Component({
  selector: 'app-setup.tfa',
  templateUrl: './setup.tfa.component.html',
  styleUrls: ['./setup.tfa.component.css']
})
export class SetupTfaComponent implements OnInit {

  textTitleToast = '';

  tfa: any = {};
  authcode: string = "";
  errorMessage: string|null = null;

  constructor(private loginService: LoginService, private router: Router, private cookieService: CookieService, private modalService: NgbModal, private toastService: ToastService) {
  }

  ngOnInit() {
  }

  modalDismiss(reason:any){
    this.modalService.dismissAll(reason);
  }

  modalClose(reason:any){
    this.modalService.dismissAll(reason);
  }

  enableTfa() {
    this.loginService.enableLoginUsingTfa().subscribe({
      next:(data) => {
        const result = data.body
        if (data.status === 200) {
          this.textTitleToast="enabled";
          this.toastService.show(`Two factor ${this.textTitleToast} with success!`, { classname: 'bg-success' });
          this.errorMessage = null;
          this.tfa.secret = this.tfa.tempSecret;
          this.tfa.tempSecret = "";
          this.router.navigateByUrl('/home');
        } else {
          this.errorMessage = data.statusText;
        }
      },
      error:(err) => {
        this.errorMessage = err || err.statusText;
        this.toastService.show(err, { classname: 'bg-danger'});
        console.error(err);
      }
    });
  }

  disableTfa() {
    this.loginService.disableLoginUsingTfa().subscribe({
      next:(data) => {
        const result = data.body
        if (data['status'] === 200) {
          this.textTitleToast="disabled";
          this.toastService.show(`Two factor ${this.textTitleToast} with success!`, { classname: 'bg-success' });
          this.authcode = "";
        }
      },
      error:(err) => {
        this.errorMessage = err || err.statusText;
        this.toastService.show(err, { classname: 'bg-danger'});
        console.error(err);
      }
    });
  }

}
