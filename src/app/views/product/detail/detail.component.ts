import {Component, Input, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductType} from "../../../../types/product.type";
import {ProductService} from "../../../shared/services/product.service";
import {ActivatedRoute, Params} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {CardProductType} from "../../../../types/card-product.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CardService} from "../../../shared/services/card.service";

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
  card: CardProductType | null = null


  constructor(private productService: ProductService,
              private activateRoute: ActivatedRoute,
              private cardService: CardService
  ) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe((params: Params) => {
      this.productService.getProduct(params['url'])
        .subscribe((data: ProductType) => {
          if (params['url']) {
            this.cardService.getCard()
              .subscribe((cardData: CardProductType): void => {
                if (cardData) {
                  const productInCard =
                    cardData.items.find(item => item.product.id === data.id)

                  if (productInCard) {
                    data.countInCard = productInCard.quantity
                    this.count = data.countInCard
                  }
                }

                this.product = data
              })
          }
        })
    })

    this.productService.getBestProduct()
      .subscribe((data: ProductType[]) => {
        this.productsRecommended = data
      })
  }

  //Обновление количества товаров
  updateCount(value: number) {
    this.count = value
    if (this.product.countInCard) {
      // Делаем данную проверку для того что бы + и - отправляли запросы в том случае если товар уже есть в корзине
      this.cardService.updateCard(this.product.id, this.count)
        .subscribe((data: CardProductType | DefaultResponseType): void => {
          this.product.countInCard = this.count
        })
    }

  }

  // Добавление товаров в корзину
  addToCard() {
    this.cardService.updateCard(this.product.id, this.count)
      .subscribe((data: CardProductType | DefaultResponseType): void => {
        this.product.countInCard = this.count
      })
  }

  // Удаление товаров
  removeFromCard(): void {
    this.cardService.updateCard(this.product.id, 0)
      .subscribe((data: CardProductType | DefaultResponseType): void => {
        this.product.countInCard = 0
        this.count = 1
      })
  }

}
