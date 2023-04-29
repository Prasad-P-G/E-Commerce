import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SignUP, login } from 'src/app/Interfaces/data-type';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userAuthErro = new EventEmitter<boolean>(false);
  constructor(private http: HttpClient, private router: Router) { }

  userSignUp(user: SignUP) {
    console.warn(user);
    this.http.post('http://localhost:3000/users', user, { observe: 'response' })
      .subscribe((userData) => {
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData.body))
          this.router.navigate(['/']);
        }
      });
  }


  userLogin(userData: login) {

    this.http.get<SignUP[]>('http://localhost:3000/users?email=' + userData.email + '&password=' + userData.password,
      { observe: 'response' }).subscribe((result) => {
        if (result && result.body?.length) {
          localStorage.setItem('user', JSON.stringify(result.body[0]))
          this.userAuthErro.emit(false);
          this.router.navigate(['/']);
        }
        else {
          this.userAuthErro.emit(true);
        }
      });
  }

  userAuthReload() {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/']);
    }
  }

}
