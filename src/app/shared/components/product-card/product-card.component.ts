import {Component, Input, OnInit} from '@angular/core';
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() product!: ProductType
  @Input() isLight: boolean = false
  public serverStaticPath = environment.serverStaticPath
  count: number = 1

  constructor() {
  }

  ngOnInit(): void {
  }

  updateCount(value: number) {
    this.count = value
  }

  addToCard() {
    console.log('added to card ' + this.count)
  }
}
