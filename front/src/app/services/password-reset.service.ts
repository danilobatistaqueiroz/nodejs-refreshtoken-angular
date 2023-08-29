import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PasswordReset } from '../models/password-reset';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  constructor(private http: HttpClient) {
  }

  passwordReset(reset:PasswordReset) {
    return this.http.post(`${environment.URL_API}/password/reset`, {userId:reset.userId,token:reset.token,password:reset.password}, { observe: "response" });
  }

  passwordResetRequest(email:string) {
    return this.http.post(`${environment.URL_API}/password/reset-request`, {email:email}, { observe: "response" });
  }

}