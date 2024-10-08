import {Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductService} from "../../../shared/services/product.service";
import {ProductType} from "../../../../types/product.type";
import {CardService} from "../../../shared/services/card.service";
import {CardProductType} from "../../../../types/card-product.type";
import {environment} from "../../../../environments/environment";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  public extraProducts: ProductType[] = []
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
  card: CardProductType | null = null
  public serverStaticPath = environment.serverStaticPath
  totalAmount: number = 0
  totalCount: number = 0
  count: number = 1


  constructor(private productService: ProductService,
              private cardService: CardService) {
  }

  ngOnInit(): void {
    this.productService.getBestProduct()
      .subscribe((data: ProductType[]) => {
        this.extraProducts = data
      })

    this.cardService.getCard()
      .subscribe((data: CardProductType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        this.card = data as CardProductType

        this.calculateTotal()
      })
  }

  calculateTotal(): void {
    this.totalAmount = 0
    this.totalCount = 0
    if (this.card) {
      this.card.items.forEach(item => {
        this.totalAmount += item.quantity * item.product.price
        this.totalCount += item.quantity
      })
    }
  }

  //Обновление количества товаров
  updateCount(id: string, value: number) {
    if (this.card) {
      this.cardService.updateCard(id, value)
        .subscribe((data: CardProductType | DefaultResponseType): void => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message)
          }
          this.card = data as CardProductType
          this.calculateTotal()
        })
    }
  }


}
