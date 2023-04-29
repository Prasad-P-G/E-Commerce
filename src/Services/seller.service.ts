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

  userSignUp(data: SignUP) {
    this.http.post('http://localhost:3000/seller', data, { observe: 'response' })
      .subscribe((result) => {
        this.isSellerLoggedIn.next(true);
        localStorage.setItem('seller', JSON.stringify(result.body))
        this.router.navigate(['seller-home']);
      });
    return false;
  }

  reloadSeller() {
    if (localStorage.getItem('seller')) {
      this.isSellerLoggedIn.next(true);
      this.router.navigate(['seller-home']);
    }
  }

  UserLogin(data: login) {
    console.warn(data.email + '' + data.password);
     let url:string = "http://localhost:3000/seller?email="+data.email+ "&password=" + data.password;
     //this.http.get('http://localhost:3000/seller?email=${data.email}&password=${data.password}',
    this.http.get(url,
      { observe: 'response' })
      .subscribe((result:any) => {
        if((result) && result.body && result.body.length){
        console.warn("Valid user");
        this.isSellerLoggedIn.next(true);
        localStorage.setItem('seller', JSON.stringify(result.body))
        this.router.navigate(['seller-home']);
        }else{
          console.warn("Invalid user");
          this.isLoginError.emit(true);
        }
      });
  }
}
