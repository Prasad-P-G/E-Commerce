import { Component, OnInit } from '@angular/core';
import { SellerService } from 'src/Services/seller.service';
import {Router} from '@angular/router';
import { SignUP, login } from '../Interfaces/data-type';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css']
})
export class SellerAuthComponent implements OnInit {
  showLogin:boolean=false;
  authError:string='';
  constructor(private seller:SellerService,private router:Router){}
  ngOnInit(): void {
   this.seller.reloadSeller();
  }

  SignUp(data:SignUP):void{
    console.warn(data);
    this.seller.userSignUp(data);
    // this.seller.userSignUp(data).subscribe((result)=>{
    //   //console.warn("Before IF")
    //    if(result){
    //     //console.warn("Inside IF")
    //       this.router.navigate(['seller-home']);
    //    }
    // });
  }
  Login(data:login):void{
         this.seller.UserLogin(data);
         this.seller.isLoginError.subscribe((isError)=>{
              if(isError){
                this.authError="Email or Password is not correct."
              }
              else{
                this.authError = '';
              }
         });
      }
  openLogin(){
    this.showLogin = true;
  }
  openSingUP(){
    this.showLogin = false;
  }
}
