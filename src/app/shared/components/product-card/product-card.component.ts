import {Component, Input, OnInit} from '@angular/core';
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {CardService} from "../../services/card.service";
import {CardProductType} from "../../../../types/card-product.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {FavoriteType} from "../../../../types/favorite.type";
import {HttpErrorResponse} from "@angular/common/http";
import {FavoriteService} from "../../services/favorite.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() product!: ProductType
  @Input() isLight: boolean = false  // Переменная для регулирования вида карточки товара
  @Input() countInCard: number | undefined = 0  // Получаем актуальное количество товаров
  public serverStaticPath = environment.serverStaticPath
  count: number = 1
  isLogged: boolean = false

  constructor(private cardService: CardService,
              private favoriteService: FavoriteService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private authService: AuthService) {
    this.isLogged = this.authService.getIsLoggedIn()
  }

  ngOnInit(): void {
    if (this.countInCard && this.countInCard > 1) {
      this.count = this.countInCard  // Обновляем актуальное количество товаров на странице
    }
  }

  //Обновление количества товаров
  updateCount(value: number) {
    this.count = value
    if (this.countInCard) {
      this.cardService.updateCard(this.product.id, this.count)
        .subscribe((data: CardProductType | DefaultResponseType ): void => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message)
          }

          this.countInCard = this.count
        })
    }
  }

  // Добавление товаров в корзину
  addToCard() {
    this.cardService.updateCard(this.product.id, this.count)
      .subscribe((data: CardProductType | DefaultResponseType ): void => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        this.countInCard = this.count
      })
  }

  // Удаление товаров
  removeFromCard(): void {
    this.cardService.updateCard(this.product.id, 0)
      .subscribe((data: CardProductType | DefaultResponseType ): void => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        this.countInCard = 0
        this.count = 1
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

  navigate() {
    if(this.isLight)
      this.router.navigate(['/product/' + this.product.url])
  }

}
