import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginServiceService } from 'src/app/services/login-service/login-service.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private loginService: LoginServiceService, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.loginService.getAuthStatus()) {
      return true;
    }
    return false;
  }

}