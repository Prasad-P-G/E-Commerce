import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/Services/product.service';
import { product } from '../Interfaces/data-type';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  matchingProducts: undefined | product[]
  constructor(private product: ProductService, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    
    let query = this.activeRoute.snapshot.paramMap.get('query');
    console.warn('Inside search component');
    //console.warn(query);
    query && this.product.SearchProducts(query).subscribe((data) => {
      console.warn(data);
      this.matchingProducts = data;
    });

  }

}
