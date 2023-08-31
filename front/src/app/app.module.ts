import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthGuardGuard } from './guards/auth-guard.guard';
import { LoginGuard } from './guards/login.guard';

import { AuthInterceptor } from './helpers/auth.interceptor';

import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SetupTfaComponent } from './modals/setup.tfa/setup.tfa.component';
import { PasswordResetComponent } from './pages/password-reset/password-reset.component';
import { PasswordResetRequestComponent } from './modals/password-reset-request/password-reset-request.component';
import { MessagesComponent } from './shared/messages/messages.component';

import { ToastService } from './services/toast.service';

const routes: Routes = [
  { path: "", redirectTo: '/login', pathMatch: 'full' },
  { path: "login", component: LoginComponent, canActivate: [LoginGuard] },
  { path: "home", component: HomeComponent, canActivate: [AuthGuardGuard] },
  { path: "register", component: RegisterComponent, canActivate: [LoginGuard] },
  { path: "password-reset", component: PasswordResetComponent },
  { path: "**", redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    SetupTfaComponent,
    PasswordResetComponent,
    PasswordResetRequestComponent,
    MessagesComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    NgbToastModule
  ],
  providers: [
    CookieService,ToastService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
