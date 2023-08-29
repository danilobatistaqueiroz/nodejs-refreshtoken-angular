import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Login } from '../models/login';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  headerOptions: any = null;

  isLoggedIn: boolean = false;

  authSub = new Subject<any>();

  tfa:TFA = new TFA(false,'','');

  constructor(private http: HttpClient) {
  }

  getTfaStatus(email: string) {
    return this.http.get(`${environment.URL_API}/user/tfa?email=${email}`, { observe:"response" });
  }

  loginAuth(login:Login,authcode:number) {
    if (authcode) {
      this.headerOptions = new HttpHeaders({
        'x-tfa': authcode.toString()
      });
    }
    return this.http.post(`${environment.URL_API}/auth/login`, { email:login.email, password:login.password }, { observe:'response', headers:this.headerOptions, withCredentials:true });
  }

  registerUser(login:Login) {
    return this.http.post(`${environment.URL_API}/auth/register`, { name:login.name, email:login.email, password:login.password, tfa:login.tfa }, { observe:"response" });
  }

  generateTfa(email:string) {
    return this.http.post(`${environment.URL_API}/tfa`, {email:email}, { observe:'response' });
  }

  getTfa() {
    return this.http.get(`${environment.URL_API}/tfa`, { withCredentials:true, observe:'response' });
  }

  enableLoginUsingTfa() {
    return this.http.post(`${environment.URL_API}/tfa/enable`, {}, { withCredentials:true, observe:'response' });
  }

  disableLoginUsingTfa() {
    return this.http.post(`${environment.URL_API}/tfa/disable`, {}, { withCredentials:true, observe:'response' });
  }

  updateAuthStatus(logged: boolean) {
    this.isLoggedIn = logged;
    this.authSub.next(this.isLoggedIn);
    localStorage.setItem('isLoggedIn', this.isLoggedIn ? "true" : "false");
  }

  getAuthStatus() {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') == "true" ? true : false;
    return this.isLoggedIn;
  }

  logoutUser() {
    this.isLoggedIn = false;
    this.authSub.next(this.isLoggedIn);
    localStorage.setItem('isLoggedIn', "false");
  }

  getUserInfo() {
    return this.http.get(`${environment.URL_API}/user`, { withCredentials:true, observe:'response' });
  }

}


class TFA {
  constructor(public enabled:boolean,public secret:string, public dataURL:string){}
}