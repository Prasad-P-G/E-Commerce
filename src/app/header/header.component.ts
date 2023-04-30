import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/Services/product.service';
import { product } from '../Interfaces/data-type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';
  sellerName: string = '';
  userName: string = '';
  searchResult: undefined | product[];
  queryString: undefined | string
  url: undefined | String
  cartItemsCout: number = 0;
  constructor(private router: Router, private product: ProductService) { }

  ngOnInit(): void {
    this.queryString = undefined;
    //Router service for route change
    this.router.events.subscribe((value: any) => {
      //checks the route change
      if (value.url) {
        if (localStorage.getItem('seller') && value.url.includes('seller')) {
          this.menuType = "seller";
          //console.warn('Inside seller area!!!!');
          //Get Seller Name
          let sellerStore = localStorage.getItem('seller');
          console.warn(sellerStore);
          
          // let sellerData = sellerStore && JSON.parse(sellerStore)[0];
          let sellerData = sellerStore && JSON.parse(sellerStore);
          this.sellerName = sellerData.name;
        }
        else if (localStorage.getItem('user')) {
          let userStore = localStorage.getItem('user');
          let userData = userStore && JSON.parse(userStore);
          this.userName = userData.name;
          this.menuType = 'user';
          this.product.getCartList(userData.id)
        }
        else {
          console.warn('Outside seller area!!!!');
          this.menuType = "default";
        }

        let cartData = localStorage.getItem('localCart');
        if (cartData) {
          this.cartItemsCout = JSON.parse(cartData).length;
        }
        // else{
        //   this.cartItemsCout = 0;
        // }
        this.product.cartData.subscribe((result)=>{
          this.cartItemsCout = result.length
        })
      }
    });

  }

  submitSearch(value: string) {
    //console.warn(this.queryString);    
    this.url = 'search/' + value;
    //console.warn(this.url); 
    this.router.navigate([this.url])
  }

  Logout() {
    localStorage.removeItem('seller');
    this.router.navigate(['/']);    
  }

  userLogout() {
    localStorage.removeItem('user');
    this.router.navigate(['user-auth']);
    this.product.cartData.emit([]);
  }

  searchProduct(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement;
      // console.warn(element.value)
      this.product.SearchProducts(element.value).subscribe((data) => {
        if (data) {
          //console.warn(data);
          //Restrict the number of items in search show
          if (data.length > 5) {
            data.length = 5
          }
          this.searchResult = data;
        }
      });
    }
  }

  HideSearch() {
    this.searchResult = undefined
  }

  redirectToDetails(value: number) {
    this.router.navigate(['/details/' + value])
  }

}
