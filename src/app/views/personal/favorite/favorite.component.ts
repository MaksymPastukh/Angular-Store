import {Component, Input, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CardProductType} from "../../../../types/card-product.type";
import {CardService} from "../../../shared/services/card.service";


@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {
  public favoriteProducts: FavoriteType[] = []
  card: CardProductType | null = null
  @Input() countInCard: number | undefined = 0  // Получаем актуальное количество товаров
  public serverStaticPath: string = environment.serverStaticPath
  count: number = 1


  constructor(private favoriteService: FavoriteService,
              private cardService: CardService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {

    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {

        if ((data as DefaultResponseType).error !== undefined) {
          const error: string = (data as DefaultResponseType).message

          throw new Error(error)
        }
        this.favoriteProducts = data as FavoriteType[]
      })

    this.cardService.getCard()
      .subscribe((data: CardProductType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        this.card = data as CardProductType
        this.favoriteProducts.map((product: FavoriteType) => {
          if (this.card && this.card.items.length > 0) {
            const countInProductCard = this.card.items.find(items => items.product.id === product.id)
            if (countInProductCard) {
              product.quantity = countInProductCard.quantity as number
            }
          }
        })
        this.favoriteProducts.find(item => {
          this.countInCard = item.quantity

          if (this.countInCard && this.countInCard > 1) {
            this.count = this.countInCard
          }
        })


        // console.log(this.countInCard)
      })

  }

  addToCard(id: string) {
    this.cardService.updateCard(id, this.count)
      .subscribe((data: CardProductType | DefaultResponseType): void => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
      })
  }


  updateCount(id: string, value: number) {
    if (this.card) {
      this.cardService.updateCard(id, value)
        .subscribe((data: CardProductType | DefaultResponseType): void => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message)
          }
          this.card = data as CardProductType
        })
    }
  }

  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorites(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          this._snackBar.open(data.message)
          throw new Error(data.message)
        }

        this.favoriteProducts = this.favoriteProducts.filter(item => item.id !== id)
        this._snackBar.open(data.message)
      })
  }
}
