import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/Services/product.service';
import { cart, priceSummary, product } from '../Interfaces/data-type';
import { faTextHeight } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  cartData: undefined | cart[]
  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  }
  constructor(private product: ProductService, private router: Router) { }
  ngOnInit(): void {
    this.loadCartDetails();
  }

  loadCartDetails() {
    this.product.getCurrentCart().subscribe((result) => {
      this.cartData = result
      if (result) {        
        let price = 0;
        result.forEach((item: cart) => {
          if (item.quantity) {
            price = price + (+item.price * item.quantity);
          }
          this.priceSummary.price = price;
          this.priceSummary.tax = price / 10;
          this.priceSummary.discount = price / 10;
          this.priceSummary.delivery = 50;
          this.priceSummary.total = price + (price / 10) - (price / 10) + 40;

          //console.warn('removed');
         
          
          
        })  
        //console.warn(price);          
      }
      console.warn(this.cartData);         
      console.warn('No of items in the cart - '+this.cartData?.length);    
      if(!this.cartData?.length){
            this.router.navigate(['/']);
          }
    });
  }

  removeFromCart(cartId: number | undefined) {
    console.warn('removing stated....');
    cartId && this.product.removeFromDBCart(cartId)      
      .subscribe((result) => {
        console.warn('removing Completed....');
        this.loadCartDetails();
      })
  }
  checkout() {
    this.router.navigate(['/checkout'])
  }
}
