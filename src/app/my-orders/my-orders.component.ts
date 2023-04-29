import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/Services/product.service';
import { order } from '../Interfaces/data-type';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orderData:undefined | order[]
  constructor(private product:ProductService){}

  ngOnInit(): void {
     this.getOrderList();
  }

  cancelOrder(orderId:number| undefined){
    orderId && this.product.cancelOrder(orderId).subscribe((result)=>{
        if(result){
          this.getOrderList();
        }
    });
  }

  getOrderList(){
    this.product.orderList().subscribe((result)=>{
      if(result){
       this.orderData = result          
      }
   });
  }

}
