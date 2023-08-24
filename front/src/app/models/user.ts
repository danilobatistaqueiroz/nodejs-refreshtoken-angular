export class User {
  constructor(public email:string, public confirmed:boolean, public enabled:boolean, public tfa:any){
  }
}