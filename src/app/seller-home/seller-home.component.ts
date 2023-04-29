import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/Services/product.service';
import { product } from '../Interfaces/data-type';
import {faTrash,faEdit} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css']
})
export class SellerHomeComponent implements OnInit {
  productList: undefined | product[]
  productMessage: undefined | string
  deleteIcon=faTrash
  editIcon=faEdit
  constructor(private product: ProductService) { }

  ngOnInit(): void {
    this.products();
  }

  products(){
    this.product.getProducts().subscribe((result) => {
      console.warn(result);
      this.productList = result;
    })
  }

  deleteProduct(id: number) {
    console.warn('deleted product id is - ', id);
    this.product.deleteProduct(id).subscribe((result) => {
      if (result) {
        this.productMessage = "Product is deleted"
        this.products();
      }
      else{
        this.productMessage = "some problem in deleting the product"
      }
    });
    setTimeout(() => {
      this.productMessage = undefined;
    }, 3000);

  }
}
