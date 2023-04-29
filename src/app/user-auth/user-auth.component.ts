import { Component, OnInit } from '@angular/core';
import { SignUP, cart, login, product } from '../Interfaces/data-type';
import { UserService } from 'src/Services/user.service';
import { ProductService } from 'src/Services/product.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit {
  showLogin: boolean = true
  authErro: string = '';
  constructor(private user: UserService, private proudct: ProductService) { }
  ngOnInit(): void {
    this.user.userAuthReload();
  }

  signUp(data: SignUP) {
    //console.warn(data);    
    this.user.userSignUp(data);
  }

  Login(data: login) {
    this.user.userLogin(data);
    this.user.userAuthErro.subscribe((result) => {
      if (result) {
        this.authErro = "User not found"
      }
      else {
        this.localCartTORemoteCart();
      }
    });
  }

  openLogin() {
    this.showLogin = true;
  }

  openSignUp() {
    this.showLogin = false
  }

  localCartTORemoteCart() {

    console.warn('add to remote cart called....');
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;

    let data = localStorage.getItem('localCart');
    if (data) {
      let cartDatalist: product[] = JSON.parse(data);
      cartDatalist.forEach((product: product, index) => {
        let cartData: cart = {
          ...product,
          productId: product.id,
          userId,
        };
        delete cartData.id

        //console.warn(cartData);

        setTimeout(() => {
          this.proudct.AddToCart(cartData).subscribe((result) => {
            console.warn('Item stored in DB');
          })
          if (cartDatalist.length === index + 1) {
            localStorage.removeItem('localCart');
          }
        }, 500);
      })
    }

    setTimeout(() => {
      this.proudct.getCartList(userId)
    }, 2000);
  }
}
