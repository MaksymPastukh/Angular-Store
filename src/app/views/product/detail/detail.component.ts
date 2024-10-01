import {Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductType} from "../../../../types/product.type";
import {ProductService} from "../../../shared/services/product.service";
import {ActivatedRoute, Params} from "@angular/router";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    margin: 24,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false
  }

  count: number = 1
  public productsRecommended: ProductType[] = []
  public product!: ProductType
  public serverStaticPath = environment.serverStaticPath


  constructor(private productService: ProductService,
              private activateRoute: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.activateRoute.params.subscribe((params: Params) => {

      this.productService.getProduct(params['url'])
        .subscribe((data: ProductType) => {
          if (params['url']) {
            this.product = data
          }
        })
    })


    this.productService.getBestProduct()
      .subscribe((data: ProductType[]) => {
        this.productsRecommended = data
      })
  }

  updateCount(value: number) {
    this.count = value
  }

  addToCard() {
    console.log('added to card ' + this.count)
  }
}
