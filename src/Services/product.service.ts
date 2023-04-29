import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Data } from '@angular/router';
import { cart, order, product } from 'src/app/Interfaces/data-type';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url: undefined | string;
  cartData = new EventEmitter<product[] | []>()

  constructor(private http: HttpClient) { }

  addProduct(data: product) {
    return this.http.post("http://localhost:3000/products", data);
  }

  getProducts() {
    return this.http.get<product[]>("http://localhost:3000/products");
  }

  deleteProduct(id: number) {
    this.url = "http://localhost:3000/products/" + id
    return this.http.delete(this.url);
  }

  getProductById(id: string) {
    this.url = "http://localhost:3000/products/" + id
    return this.http.get<product>(this.url);
  }

  updataProduct(data: product) {
    //console.warn(data); 
    this.url = "http://localhost:3000/products/" + data.id
    //console.warn(this.url);
    return this.http.put(this.url, data);
  }

  popularProducts() {
    let _limit = 3
    return this.http.get<product[]>('http://localhost:3000/products?_limit=8');
  }

  TrendyProducts() {
    return this.http.get<product[]>('http://localhost:3000/products?_limit=8');
  }

  SearchProducts(query: string) {
    this.url = "http://localhost:3000/products?q=" + query
    console.warn(this.url);
    return this.http.get<product[]>(this.url);
  }

  localAddtoCart(data: product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
      //let localCart = localStorage.getItem('localCart');
      localCart = localStorage.getItem('localCart');
      cartData = localCart && JSON.parse(localCart);
      //this.cartData.emit(cartData)
    }
    else {
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData));
    }
    this.cartData.emit(cartData);
  }

  removeItemFromCart(productId: number) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      let items: product[] = JSON.parse(cartData);
      items = items.filter((item: product) => item.id !== productId);
      if (items.length > 0) {
        localStorage.setItem('localCart', JSON.stringify(items));
        this.cartData.emit(items);
      }
    }
  }

  removeFromDBCart(cartId: number) {

    return this.http.delete('http://localhost:3000/cart/' + cartId);

  }

  AddToCart(cartData: cart) {
    return this.http.post('http://localhost:3000/cart', cartData);
  }

  getCartList(userId: number) {
    return this.http.get<product[]>('http://localhost:3000/cart?userId=' + userId,
      { observe: 'response' }).subscribe((result) => {
        if (result && result.body) {
          this.cartData.emit(result.body)
        }
      });
  }

  getCurrentCart() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<cart[]>('http://localhost:3000/cart?userId=' + userData.id)

  }

  orderNow(data: order) {
    return this.http.post('http://localhost:3000/orders', data);
  }

  orderList() {
    let userStore = localStorage.getItem('user');
    let userId = userStore && JSON.parse(userStore).id;
    return this.http.get<order[]>('http://localhost:3000/orders?userId=' + userId);
  }

  deleteCartItems(cartId:number){
   return this.http.delete('http://localhost:3000/cart/' + cartId,{observe:'response'})
          .subscribe((result)=>{
            if(result){
            this.cartData.emit([])
            }
          });
  }

  cancelOrder(orderId:number){
    return this.http.delete('http://localhost:3000/orders/' + orderId);

  }
}
