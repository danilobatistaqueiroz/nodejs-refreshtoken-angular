import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetupTfaComponent } from '../../modals/setup.tfa/setup.tfa.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn: boolean = false;

  closeResult = '';

  constructor(private loginService: LoginService, 
    private modalService: NgbModal,
    private router: Router, ) {
    this.loginService.authSub.subscribe((data) => {
      this.isLoggedIn = data
    })
  }

  ngOnInit() {
    this.isLoggedIn = this.loginService.getAuthStatus()
  }

  setupTfa() {
    this.modalService.open(SetupTfaComponent, { size: 'sm', backdrop: 'static', centered:true,keyboard: false, windowClass:'tfa-modal', ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
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

  toggleMenuBar() {
    let collapsible = document.getElementById("collapsibleNavId");
    if(!collapsible)
      return;
    if(collapsible.style.display == "block") {
      collapsible.style.display = "none";
    } else {
      collapsible.style.display = "block";
    }
  }

  logout() {
    this.loginService.logoutUser()
    this.router.navigate(['/login'])
  }

}