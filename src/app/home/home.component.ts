import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgFor, NgIf } from '@angular/common';
import { ProductService } from 'src/Services/product.service';
import { product } from '../Interfaces/data-type';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images = [1055, 194, 368].map((n) => `https://picsum.photos/id/${n}/900/500`);
  popularProducts:undefined | product[];
  TrendyProducts: undefined | product[]

  constructor(private product:ProductService) {   
	}
  ngOnInit(): void {
    this.product.popularProducts().subscribe((data)=>{
      if(data){
        this.popularProducts = data;              
      }
    });

    this.product.TrendyProducts().subscribe((data)=>{
      if(data){
      this.TrendyProducts = data;
      }
    });
  }


}
