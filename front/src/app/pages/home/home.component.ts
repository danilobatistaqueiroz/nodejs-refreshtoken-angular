import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../../services/login-service/login-service.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user:User|null=null;

  constructor(private loginService: LoginServiceService) {
  }

  ngOnInit() {
    this.loginService.getUserInfo().subscribe(data => {
      this.user = (data.body as any).user;
    });
  }


}