import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user:User|null=null;

  constructor(private loginService: LoginService) {
  }

  ngOnInit() {
    this.loginService.getUserInfo().subscribe(data => {
      this.user = (data.body as any).user;
    });
  }


}