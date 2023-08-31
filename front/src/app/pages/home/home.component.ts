import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { User } from '../../models/user';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user:User|null=null;

  constructor(private loginService: LoginService,private toastService: ToastService) {
  }

  ngOnInit() {
    this.loginService.getUserInfo().subscribe({
      next:(data) => {
        this.user = (data.body as any).user;
      },
      error:(err) => {
        console.error(err);
        this.toastService.show(err, { classname: 'bg-danger' , style: {'min-width':'280px'}});
      }
    });
  }


}