import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuardGuard } from './guards/auth-guard.guard';
import { LoginGuard } from './guards/login.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { SetupTfaComponent } from './modals/setup.tfa/setup.tfa.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  { path: "", redirectTo: '/login', pathMatch: 'full' },
  { path: "login", component: LoginComponent, canActivate: [LoginGuard] },
  { path: "home", component: HomeComponent, canActivate: [AuthGuardGuard] },
  { path: "register", component: RegisterComponent, canActivate: [LoginGuard] },
  /*{ path: "remember-password", component: RegisterComponent, canActivate: [LoginGuard] },*/
  { path: "**", redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    SetupTfaComponent
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
  providers: [CookieService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
