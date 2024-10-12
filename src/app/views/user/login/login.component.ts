import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  })

  constructor(private fb: FormBuilder,
              private authServices: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router
  ) {
  }


  login(): void {
    if (this.loginForm.valid
      && this.loginForm.value.email
      && this.loginForm.value.password
    ) {
      this.authServices.login(
        this.loginForm.value.email,
        this.loginForm.value.password,
        !!this.loginForm.value.rememberMe)
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
            let error = null
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message
            }

            const loginResponse: LoginResponseType = data as LoginResponseType
            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = `Ошибка при авторизации`
            }

            if (error) {
              this._snackBar.open(error)
              throw new Error(error)
            }

            this.authServices.setTokens(loginResponse.accessToken, loginResponse.refreshToken)
            this.authServices.userId = loginResponse.userId
            this._snackBar.open(`Вы успешно авторизовались`)
            this.router.navigate(['/'])
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message)
            } else {
              this._snackBar.open(`Ошибка при авторизации`)
            }
          }
        })
    }
  }



}
