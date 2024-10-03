import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../../shared/services/product.service";
import {ProductType} from "../../../../types/product.type";
import {CategoryService} from "../../../shared/services/category.service";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtils} from "../../../shared/utils/active-params.utils";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {debounceTime} from "rxjs";
import {CardService} from "../../../shared/services/card.service";
import {CardProductType} from "../../../../types/card-product.type";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {FavoriteService} from "../../../shared/services/favorite.service";
import {AuthService} from "../../../core/auth/auth.service";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  public products: ProductType[] = []
  categoriesWithTypes: CategoryWithTypeType[] = []
  public activeParams: ActiveParamsType = {
    types: []
  }

  appliedFilters: AppliedFilterType[] = []
  sortingOpen: boolean = false
  sortingOptions: { name: string, value: string }[] = [
    {name: 'От А до Я', value: 'az-asc'},
    {name: 'От Я до А', value: 'az-desc'},
    {name: 'По возрастанию цены', value: 'price-asc'},
    {name: 'По убыванию цены', value: 'price-desc'},
  ]
  pages: number[] = []
  card: CardProductType | null = null
  favoriteProducts: FavoriteType[] | null = null

  constructor(private productService: ProductService,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private cardService: CardService,
              private favoriteService: FavoriteService,
              private authService: AuthService,
              private router: Router
  ) {
  }

  ngOnInit(): void {
    this.cardService.getCard()
      .subscribe((data: CardProductType | DefaultResponseType): void => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        this.card = data as CardProductType

        if(this.authService.getIsLoggedIn()) {
          this.favoriteService.getFavorites()
            .subscribe({
                next: (data: FavoriteType[] | DefaultResponseType) => {
                  if ((data as DefaultResponseType).error !== undefined) {
                    const error: string = (data as DefaultResponseType).message
                    this.processCatalog()
                    throw new Error(error)
                  }

                  this.favoriteProducts = data as FavoriteType[]
                  this.processCatalog()
                },
                error: (error) => {
                  this.processCatalog()
                }
              }
            )
        } else  {
          this.processCatalog()
        }

      })
  }

  processCatalog() {
    this.categoryService.getCategoriesWithTypes()
      .subscribe((data: CategoryWithTypeType[]): void => {
        this.categoriesWithTypes = data

        // В эту функцию мы попадаем после того как параметры изменяются на странице
        this.activatedRoute.queryParams
          .pipe(
            // Делаем задержу перед отправкой запроса, для того что бы subscribe не срабатывал для каждого моментального изменения url
            debounceTime(500)
          )
          .subscribe((param: Params) => {
            this.activeParams = ActiveParamsUtils.processParams(param)
            // Когда параметры изменились мы первым делом обнуляем массив appliedFilters

            this.appliedFilters = []
            // И з заново наполняем массив фильтрами которые нужно отобразить

            this.activeParams.types.forEach((url: string): void => {
              for (let i = 0; i < this.categoriesWithTypes.length; i++) {
                const foundType = this.categoriesWithTypes[i].types.find(type => type.url === url)
                if (foundType) {
                  this.appliedFilters.push({
                    name: foundType.name,
                    urlParam: foundType.url,
                  })
                }
              }
            })

            if (this.activeParams.heightFrom) {
              this.appliedFilters.push({
                name: `Высота: от ${+this.activeParams.heightFrom} см`,
                urlParam: 'heightFrom',
              })
            }
            if (this.activeParams.heightTo) {
              this.appliedFilters.push({
                name: `Высота: до ${+this.activeParams.heightTo} см`,
                urlParam: 'heightTo',
              })
            }
            if (this.activeParams.diameterFrom) {
              this.appliedFilters.push({
                name: `Диаметр: от ${+this.activeParams.diameterFrom} см`,
                urlParam: 'diameterFrom',
              })
            }
            if (this.activeParams.diameterTo) {
              this.appliedFilters.push({
                name: `Диаметр: до ${+this.activeParams.diameterTo} см`,
                urlParam: 'diameterTo',
              })
            }

            this.productService.getProducts(this.activeParams)
              .subscribe((data) => {
                this.pages = []
                for (let i: number = 1; i <= data.pages; i++) {
                  this.pages.push(i)
                }

                if (this.card && this.card.items.length > 0) {
                  this.products = data.items.map((product: ProductType) => {
                    if (this.card) {
                      const productInCard =
                        this.card.items.find(item => item.product.id === product.id)
                      if (productInCard) {
                        product.countInCard = productInCard.quantity
                      }
                    }

                    return product
                  })
                } else {
                  this.products = data.items
                }

                if (this.favoriteProducts) {
                  this.products = this.products.map((product: ProductType) => {
                    const productInFavorite = this.favoriteProducts?.find(item => item.id === product.id)
                    if (productInFavorite) {
                      product.isInFavorite = true
                    }

                    return product
                  })
                }

              })
          })
      })
  }

  // Удаляем appliedFilters
  removeAppliedFilters(appliedFilter: AppliedFilterType): void {
    if (appliedFilter.urlParam === 'heightFrom' ||
      appliedFilter.urlParam === 'heightTo' ||
      appliedFilter.urlParam === 'diameterFrom' ||
      appliedFilter.urlParam === 'diameterTo'
    ) {
      delete this.activeParams[appliedFilter.urlParam]
    } else {
      this.activeParams.types = this.activeParams.types.filter(item => item !== appliedFilter.urlParam)
    }

    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    })
  }

  toggleSorting(): void {
    this.sortingOpen = !this.sortingOpen
  }

  sort(value: string): void {
    this.activeParams.sort = value

    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    })
  }

  openPage(page: number): void {
    this.activeParams.page = page
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    })
  }

  openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--
      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams
      })
    }
  }

  openNextPage(): void {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++
      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams
      })
    }
  }
}
