import {Component, Input, OnInit} from '@angular/core';
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {CardService} from "../../services/card.service";
import {CardProductType} from "../../../../types/card-product.type";
import {DefaultResponseType} from "../../../../types/default-response.type";

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

  constructor(private cardService: CardService) {
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
        .subscribe((data: CardProductType ): void => {
          this.countInCard = this.count
        })
    }
  }

  // Добавление товаров в корзину
  addToCard() {
    this.cardService.updateCard(this.product.id, this.count)
      .subscribe((data: CardProductType ): void => {
        this.countInCard = this.count
      })
  }

  // Удаление товаров
  removeFromCard(): void {
    this.cardService.updateCard(this.product.id, 0)
      .subscribe((data: CardProductType ): void => {
        this.countInCard = 0
        this.count = 1
      })
  }

}
