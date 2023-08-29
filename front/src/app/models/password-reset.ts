export class PasswordReset {
  constructor(public userId:string, public token:string, public password:string, public confirmpass:string){
  }
}