import { Component, OnInit } from '@angular/core';
import { product } from '../Interfaces/data-type';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/Services/product.service';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css']
})
export class SellerUpdateProductComponent implements OnInit {

  productData: undefined | product
  productUpdateMessage: undefined | string
  constructor(private route: ActivatedRoute,private router:Router,
     private product: ProductService) {

  }
  ngOnInit(): void {
    let productId = this.route.snapshot.paramMap.get('id')
    //console.warn('the current product id -  ', productId)
    productId && this.product.getProductById(productId).subscribe((data) => {
      this.productData = data;
    })
  }

  updateProduct(data: product) {
    //console.warn(data);
    if(this.productData){
      data.id = this.productData.id;
    }
    this.product.updataProduct(data)
    .subscribe((result) => {
      if (result) {
        console.warn(result)
        this.productUpdateMessage = "Product has been updated"
      }
      setTimeout(() => {
        this.productUpdateMessage = undefined
      }, 3000);
      this.router.navigate(['seller-home'])
    });
  }
}
