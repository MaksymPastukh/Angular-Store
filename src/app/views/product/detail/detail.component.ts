import {Component, Input, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductType} from "../../../../types/product.type";
import {ProductService} from "../../../shared/services/product.service";
import {ActivatedRoute, Params} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {CardProductType} from "../../../../types/card-product.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CardService} from "../../../shared/services/card.service";
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../../core/auth/auth.service";

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
  public favoriteProducts: FavoriteType[] = []
  public product!: ProductType
  public serverStaticPath = environment.serverStaticPath
  card: CardProductType | null = null
  isLogged: boolean = false


  constructor(private productService: ProductService,
              private activateRoute: ActivatedRoute,
              private cardService: CardService,
              private favoriteService: FavoriteService,
              private _snackBar: MatSnackBar,
              private authService: AuthService) {
    this.isLogged = this.authService.getIsLoggedIn()
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe((params: Params) => {
      this.productService.getProduct(params['url'])
        .subscribe((data: ProductType) => {
          if (params['url']) {
            this.product = data

            this.cardService.getCard()
              .subscribe((cardData: CardProductType | DefaultResponseType): void => {
                if ((cardData as DefaultResponseType).error !== undefined) {
                  throw new Error((cardData as DefaultResponseType).message)
                }

                const cardDataResponse = cardData as CardProductType

                if (cardDataResponse) {
                  const productInCard = cardDataResponse.items.find(item => item.product.id === this.product.id)

                  if (productInCard) {
                    data.countInCard = productInCard.quantity
                    this.count = this.product.countInCard as number
                  }
                }

              })

            if (this.authService.getIsLoggedIn()) {
              this.favoriteService.getFavorites()
                .subscribe((data: FavoriteType[] | DefaultResponseType) => {
                  if ((data as DefaultResponseType).error !== undefined) {


                    const error: string = (data as DefaultResponseType).message
                    throw new Error(error)
                  }
                  this.favoriteProducts = data as FavoriteType[]
                  const currentProductExists =
                    this.favoriteProducts.find(item => item.id === this.product.id)

                  if (currentProductExists) {
                    this.product.isInFavorite = true
                  }
                })
            }
          }
        })
    })

    this.productService.getBestProduct()
      .subscribe((data: ProductType[]) => {
        this.productsRecommended = data
      })
  }

  updateFavorite(id: string) {
    if (!this.authService.getIsLoggedIn()) {
      this._snackBar.open('Необходима авторизация')
      return
    }
    if (this.product.isInFavorite) {
      this.favoriteService.removeFavorites(id)
        .subscribe((data: DefaultResponseType) => {
          if (data.error) {
            throw new Error(data.message)
          }

          this.product.isInFavorite = false
          this.favoriteProducts = this.favoriteProducts.filter(item => item.id !== id)

          this._snackBar.open(data.message)
        })
    } else {
      this.favoriteService.addToFavorites(id)
        .subscribe({
          next: (data: FavoriteType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              this._snackBar.open((data as DefaultResponseType).message)
              throw new Error((data as DefaultResponseType).message)
            }
            this.product.isInFavorite = true

          }, error: (error: HttpErrorResponse) => {
            this._snackBar.open('Необходима авторизация')
          }
        })
    }
  }

  //Обновление количества товаров
  updateCount(value: number) {
    this.count = value
    if (this.product.countInCard) {
      // Делаем данную проверку для того что бы + и - отправляли запросы в том случае если товар уже есть в корзине
      this.cardService.updateCard(this.product.id, this.count)
        .subscribe((data: CardProductType | DefaultResponseType): void => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message)
          }
          this.product.countInCard = this.count
        })
    }

  }

  // Добавление товаров в корзину
  addToCard() {
    this.cardService.updateCard(this.product.id, this.count)
      .subscribe((data: CardProductType | DefaultResponseType): void => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        this.product.countInCard = this.count
      })
  }

  // Удаление товаров
  removeFromCard(): void {
    this.cardService.updateCard(this.product.id, 0)
      .subscribe((data: CardProductType | DefaultResponseType): void => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        this.product.countInCard = 0
        this.count = 1
      })
  }

}
