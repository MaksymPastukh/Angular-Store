import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {CardService} from "../../services/card.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CardServiceType} from "../../../../types/card-service.type";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  isLogged: boolean = false
  @Input('category')
  public categories!: CategoryWithTypeType[]
  public count: number = 0

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private cardService: CardService) {
    this.isLogged = this.authService.getIsLoggedIn()
  }

  ngOnInit(): void {
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

  logout(): void {
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

  doLogout(): void {
    this.authService.removeTokens()
    this.authService.userId = null
    this._snackBar.open(`Вы успешно вышли из системы`)
    this.router.navigate(['/'])
  }

}
