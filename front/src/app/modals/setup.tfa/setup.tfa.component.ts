import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginServiceService } from 'src/app/services/login-service/login-service.service';
import { CookieService } from 'ngx-cookie-service';
import { Login } from '../../models/login';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-setup.tfa',
  templateUrl: './setup.tfa.component.html',
  styleUrls: ['./setup.tfa.component.css']
})
export class SetupTfaComponent implements OnInit {

  showToast = false;
  autohideToast = true;
  textTitleToast = '';

  tfa: any = {};
  authcode: string = "";
  errorMessage: string|null = null;

  constructor(private loginService: LoginServiceService, private router: Router, private cookieService: CookieService, private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  closeToast() {
    setTimeout(() => (this.showToast = false), 1500);
  }

  modalDismiss(reason:any){
    this.modalService.dismissAll(reason);
  }

  modalClose(reason:any){
    this.modalService.dismissAll(reason);
  }

  enableTfa() {
    this.loginService.enableLoginUsingTfa().subscribe((data) => {
      const result = data.body
      if (data.status === 200) {
        this.textTitleToast="enabled";
        this.showToast=true;
        this.errorMessage = null;
        this.tfa.secret = this.tfa.tempSecret;
        this.tfa.tempSecret = "";
        this.router.navigateByUrl('/home');
      } else {
        this.errorMessage = data.statusText;
      }
    });
  }

  disableTfa() {
    this.loginService.disableLoginUsingTfa().subscribe((data) => {
      const result = data.body
      if (data['status'] === 200) {
        this.textTitleToast="disabled";
        this.showToast=true;
        this.authcode = "";
      }
    });
  }

}
