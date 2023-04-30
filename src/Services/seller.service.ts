import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SignUP, login } from 'src/app/Interfaces/data-type';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  isSellerLoggedIn = new BehaviorSubject<boolean>(false);
  isLoginError=new EventEmitter<boolean>(false);
  constructor(private http: HttpClient, private router: Router) { }

  // http://localhost:81/api/seller/search/peter
  // http://localhost:3000/seller
  userSignUp(data: SignUP) {
    this.http.post('http://localhost:81/api/seller', data, { observe: 'response' })
      .subscribe((result) => {
        console.warn((result.body))
        
        this.isSellerLoggedIn.next(true);
        localStorage.setItem('seller', JSON.stringify(result.body)[0])
        //this.router.navigate(['seller-home']);
      });
    return false;
  }

  reloadSeller() {
    if (localStorage.getItem('seller')) {
      this.isSellerLoggedIn.next(true);
      this.router.navigate(['seller-home']);
    }
  }

  // http://localhost:3000/seller?email=
  UserLogin(data: login) {
    console.warn(data.email + ' ' + data.password);
    //  let url:string = 'http://localhost:81/api/seller/'+data.email+ "&password=" + data.password;
    let url:string = 'http://localhost:81/api/seller/'+data.email+ "/" + data.password;
     //this.http.get('http://localhost:3000/seller?email=${data.email}&password=${data.password}',
    this.http.get(url,
      { observe: 'response' }).subscribe((result:any) => {
        console.warn(result.body);        
        if(result.body){
        console.warn("Valid user");
        this.isSellerLoggedIn.next(true);
        localStorage.setItem('seller', JSON.stringify(result.body))
        //localStorage.setItem('seller', JSON.stringify(result))
        this.router.navigate(['seller-home']);
        }else{
          console.warn("Invalid user");
          this.isLoginError.emit(true);
        }
      });
  }
}
