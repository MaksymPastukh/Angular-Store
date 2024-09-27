import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {CategoryService} from "../../services/category.service";
import {CategoryType} from "../../../../types/category.type";
import {LayoutComponent} from "../layout.component";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLogged: boolean = false
  @Input('category')
  public categories!: CategoryType[]

  constructor(private authService: AuthService, private _snackBar: MatSnackBar,
              private router: Router) {
    this.isLogged = this.authService.getIsLoggedIn()
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn
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
