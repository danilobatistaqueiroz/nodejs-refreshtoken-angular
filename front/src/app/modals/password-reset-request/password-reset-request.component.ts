import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericResponse } from 'src/app/models/generic.response';
import { PasswordResetService } from 'src/app/services/password-reset.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-password-reset-request',
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.css']
})
export class PasswordResetRequestComponent implements OnInit, OnDestroy {

  errorMessage: string | null = null;

  @Input() email!: string;

  constructor(private modalService: NgbModal, private passwordResetService: PasswordResetService, private toastService: ToastService) { }

  ngOnInit(): void {
  }

  modalDismiss(reason: any) {
    this.modalService.dismissAll(reason);
  }

  sendEmail() {
    this.passwordResetService.passwordResetRequest(this.email).subscribe({
      next: (data) => {
        if (data == null || data.body == null) {
          this.toastService.show("Something's gone wronge!", {classname:'bg-danger',style:{'min-width':'250px'}});
          return;
        }
        if (data.status === 200) {
          this.toastService.show('Email sent with success!', {classname:'bg-success',style:{'min-width':'250px'} });
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error;
      }
    });
    this.modalDismiss('send');
  }

  ngOnDestroy(): void {
    setTimeout(()=>this.toastService.clear(),10000);
  }

}
