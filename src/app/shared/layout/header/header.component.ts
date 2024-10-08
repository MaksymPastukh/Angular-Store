import {Component, HostListener, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {CardService} from "../../services/card.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CardServiceType} from "../../../../types/card-service.type";
import {ProductService} from "../../services/product.service";
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  searchField = new FormControl
  isShowSearch: boolean = false
  products: ProductType[] = []
  isLogged: boolean = false
  @Input('category')
  public categories!: CategoryWithTypeType[]
  public count: number = 0
  public serverStaticPath = environment.serverStaticPath

  constructor(private authService: AuthService,
              private productService: ProductService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private cardService: CardService) {
    this.isLogged = this.authService.getIsLoggedIn()
  }

  ngOnInit(): void {
    this.searchField.valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe(value => {
        if (value && value.length > 2) {
          this.productService.getSearchProduct(value)
            .subscribe(((data: ProductType[]) => {
              this.products = data
              this.isShowSearch = true

            }))
        } else {
          this.products = []
        }
      }
    )

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn
    })

    this.cardService.getCardCount()
      .subscribe((data: CardServiceType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        this.count = (data as CardServiceType).count
      })

    this.cardService.count$
      .subscribe(count => {
        this.count = count
      })
  }

  logout()
    :
    void {
    this.authService.logout()
      .subscribe({
        next: (): void => {
          this.doLogout()
        },
        error: (): void => {
          this.doLogout()
        }
      })
  }

  doLogout()
    :
    void {
    this.authService.removeTokens()
    this.authService.userId = null
    this._snackBar.open(`Вы успешно вышли из системы`)
    this.router.navigate(['/'])
  }

  // changedSearchValue(newValue: string) {
  //   this.searchValue = newValue
  //
  //   if (this.searchValue && this.searchValue.length > 2) {
  //     this.productService.getSearchProduct(this.searchValue)
  //       .subscribe(((data: ProductType[]) => {
  //         this.products = data
  //         this.isShowSearch = true
  //
  //       }))
  //   } else {
  //     this.products = []
  //   }
  // }

  selectProduct(url
                  :
                  string
  ) {
    this.router.navigate(["/product/" + url])
    this.searchField.setValue('')
    this.products = []
  }

  // changeShowedSearch(valur: boolean) {
  //   setTimeout(() => {
  //     this.isShowSearch = valur
  //   }, 100)
  //
  // }

  @HostListener('document:click', ['$event'])
  click(event
          :
          Event
  ) {
    if (this.isShowSearch && (event.target as HTMLElement).className.indexOf('search-product') === -1) {
      this.isShowSearch = false
    }
  }
}
