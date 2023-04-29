import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/Services/product.service';
import { cart, order } from '../Interfaces/data-type';
import { isArrayLiteralExpression } from 'typescript';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice:number | undefined
  cartData:cart[] | undefined
  orderMessage:string | undefined
  constructor(private product:ProductService,private router:Router){}

  ngOnInit(): void {
    this.product.getCurrentCart().subscribe((result) => {
      if (result) {
        let price = 0;
        this.cartData = result //store cart data for deleting the count from cart(count)
        result.forEach((item) => {
          if (item.quantity) {
            price = price + (+item.price * item.quantity);
          }          
        })
        this.totalPrice = price + (price/10) - (price/10) + 40;
      }
    });
  }

  orderNow(data:{email:string,address:string,contact:string}){
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;

    if(this.totalPrice){
      let orderData:order = {
        ...data,
        totalPrice:this.totalPrice,
        userId,
        id:undefined

      }

      //Delete cart items
      this.cartData?.forEach((item)=>{
        setTimeout(() => {
        item.id &&  this.product.deleteCartItems(item.id)
        }, 700);
      })

      this.product.orderNow(orderData).subscribe((result)=>{
        if(result){
          this.orderMessage ='Your order has been placed'
          setTimeout(() => {
            this.router.navigate(['/my-orders'])
            this.orderMessage = undefined
          }, 4000);
        }
      });
    }

  }

}
