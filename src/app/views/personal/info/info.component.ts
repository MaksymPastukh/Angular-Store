import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {PaymentType} from "../../../../types/payment.type";
import {DeliveryType} from "../../../../types/delivery.type";
import {UserService} from "../../../shared/services/user.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {UserType} from "../../../../types/user.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  deliveryType: DeliveryType = DeliveryType.delivery
  deliveryTypes = DeliveryType
  paymentTypes = PaymentType
  userInfoForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    fatherName: [''],
    phone: [''],
    paymentType: [PaymentType.cashToCourier],
    // deliveryType: [DeliveryType.delivery],
    email: ['', [Validators.required]],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: [''],
  })


  constructor(private fb: FormBuilder,
              private userService: UserService,
              private _snackBar: MatSnackBar,
              private router: Router) {
  }

  ngOnInit(): void {
    this.userService.getUserInfo()
      .subscribe((data: UserType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }

        const userInfo = data as UserType

        const paramsToUpdate = {
          firstName: userInfo.firstName ? userInfo.firstName : '',
          lastName: userInfo.lastName ? userInfo.lastName : '',
          fatherName: userInfo.fatherName ? userInfo.fatherName : '',
          phone: userInfo.phone ? userInfo.phone : '',
          paymentType: userInfo.paymentType ? userInfo.paymentType : PaymentType.cashToCourier,
          email: userInfo.email ? userInfo.email : '',
          street: userInfo.street ? userInfo.street : '',
          house: userInfo.house ? userInfo.house : '',
          entrance: userInfo.entrance ? userInfo.entrance : '',
          apartment: userInfo.apartment ? userInfo.apartment : '',
        }
        this.userInfoForm.setValue(paramsToUpdate)
        if(userInfo.deliveryType) {
          this.deliveryType = userInfo.deliveryType
        }
      })
  }

  changeDelivery(type: DeliveryType) {
    this.deliveryType = type
    // this.userInfoForm.get('deliveryType')?.setValue(type)
    this.userInfoForm.markAsDirty() // Отмечаем что мы работали с формой
  }

  updateUserInfo() {
    if (this.userInfoForm.valid && this.userInfoForm.value.email) {

      const paramObject: UserType = {   // Параметры без которых работа с формой не возможна
        email: this.userInfoForm.value.email,
        deliveryType: this.deliveryType,
        paymentType: this.userInfoForm.value.paymentType ? this.userInfoForm.value.paymentType : PaymentType.cashToCourier
      }

      // Тут мы проверяем остальные input, если в них пользователь, что-то написал, то устанавливаем данные в обьект
      if (this.userInfoForm.value.firstName) {
        paramObject.firstName = this.userInfoForm.value.firstName
      }
      if (this.userInfoForm.value.lastName) {
        paramObject.lastName = this.userInfoForm.value.lastName
      }
      if (this.userInfoForm.value.fatherName) {
        paramObject.fatherName = this.userInfoForm.value.fatherName
      }
      if (this.userInfoForm.value.phone) {
        paramObject.phone = this.userInfoForm.value.phone
      }
      if (this.userInfoForm.value.street) {
        paramObject.street = this.userInfoForm.value.street
      }
      if (this.userInfoForm.value.house) {
        paramObject.house = this.userInfoForm.value.house
      }
      if (this.userInfoForm.value.entrance) {
        paramObject.entrance = this.userInfoForm.value.entrance
      }
      if (this.userInfoForm.value.apartment) {
        paramObject.apartment = this.userInfoForm.value.apartment
      }

      this.userService.updateUserInfo(paramObject)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              this._snackBar.open(data.message)
              throw new Error((data as DefaultResponseType).message)
            }

            this._snackBar.open(`Данные успешно сохранены`)
            this.userInfoForm.markAsPristine()  // После сохранения данных чистим наше взаимодействие с формой
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
