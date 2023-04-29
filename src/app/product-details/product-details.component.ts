import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/Services/product.service';
import { cart, product } from '../Interfaces/data-type';
import { JsonPipe } from '@angular/common';
import { isJSDocThisTag } from 'typescript';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productDetails: undefined | product
  productQuantity: number = 1
  removeCart = false
  cartData: product | undefined
  constructor(private route: ActivatedRoute, private product: ProductService) { }

  ngOnInit(): void {

    let productId = this.route.snapshot.paramMap.get('productId');

    productId && this.product.getProductById(productId).subscribe((details) => {
      if (details) {
        //console.warn(details)
        this.productDetails = details
      }
    });

    //If current product exists in the local cart - Remove addCart button
    let cartData = localStorage.getItem('localCart');
    if (productId && cartData) {
      let items = JSON.parse(cartData);
      items = items.filter((item: product) => item.id.toString() === productId)
      if (items.length > 0) {
        this.removeCart = true;
      }
      else {
        this.removeCart = false;
      }
    }

    let user = localStorage.getItem('user');
    if (user) {
      let userId = JSON.parse(user).id;
      this.product.getCartList(userId);
      this.product.cartData.subscribe((result) => {
        let item = result.filter((item: product) => item.productId?.toString() === productId?.toString())
        if (item.length) {
          this.cartData = item[0];
          this.removeCart = true;
        }
      });
    }

  }

  handleQuantity(value: string) {
    if (value == 'plus' && this.productQuantity < 20) {
      this.productQuantity += 1
    }
    if (value == 'min' && this.productQuantity > 1) {
      this.productQuantity -= 1
    }
  }

  addToCart() {
    if (this.productDetails) {
      this.productDetails.quantity = this.productQuantity
      if (!localStorage.getItem('user')) {
        this.product.localAddtoCart(this.productDetails);
        this.removeCart = true;
      }
      else {
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id;
        let cartData: cart = {
          ...this.productDetails,
          userId,
          productId: this.productDetails.id
        }
        delete cartData.id;

        //   Add to cart
        this.product.AddToCart(cartData).subscribe((result) => {
          //udpate cart count
          if (result) {
            this.product.getCartList(userId);
            this.removeCart = true;
          }
        });
      }
    }
  }

  removeFromCart(productId: number) {

    if (!localStorage.getItem('user')) {
      this.product.removeItemFromCart(productId);
      this.removeCart = false;
    }
    else {//If user logged in
      let user = localStorage.getItem('user');
      let userId = user && JSON.parse(user).id;

      this.cartData && this.product.removeFromDBCart(this.cartData.id)
        .subscribe((result) => {
          if (result) {
              this.product.getCartList(userId);
          }
        })
    }
    this.removeCart = false;
    //  let userId = JSON.parse(user).id;
  }
}
