export class Login {
  constructor(public email:string, public password:string, public authcode:string, public confirmpass:string, public tfa:boolean){
  }
}