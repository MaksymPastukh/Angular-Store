import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CardService} from "../../../shared/services/card.service";
import {CardProductType} from "../../../../types/card-product.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DeliveryType} from "../../../../types/delivery.type";
import {FormBuilder, Validators} from "@angular/forms";
import {PaymentType} from "../../../../types/payment.type";
import {MatDialog} from "@angular/material/dialog";
import {MatDialogRef} from "@angular/material/dialog/dialog-ref";
import {OrderService} from "../../../shared/services/order.service";
import {OrderType} from "../../../../types/order.type";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../../../shared/services/user.service";
import {UserType} from "../../../../types/user.type";
import {AuthService} from "../../../core/auth/auth.service";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  deliveryType: DeliveryType = DeliveryType.delivery
  deliveryTypes = DeliveryType
  paymentTypes = PaymentType
  public card: CardProductType | null = null
  totalAmount: number = 0
  totalCount: number = 0
  dialogRef: MatDialogRef<any> | null = null

  orderForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: ['', Validators.required],
    fatherName: [''],
    paymentType: [PaymentType.cashToCourier, Validators.required],
    email: ['', [Validators.required, Validators.email]],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: [''],
    comment: [''],
  })


  @ViewChild('popup') popup!: TemplateRef<ElementRef>

  constructor(private cardService: CardService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private userService: UserService,
              private authService: AuthService,
              private dialog: MatDialog,
              private orderService: OrderService,
              private fb: FormBuilder) {
    this.updateDeliveryTypeValidator()
  }

  ngOnInit(): void {
    this.cardService.getCard()
      .subscribe((data: CardProductType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }

        this.card = data as CardProductType
        if (!this.card || (this.card && this.card.items.length === 0)) {
          this._snackBar.open('Корзина пустая')
          this.router.navigate(['/'])
          return
        }
        this.calculateTotal()
      })

    if(this.authService.getIsLoggedIn()) {
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
            comment: ''
          }
          this.orderForm.setValue(paramsToUpdate)
          if (userInfo.deliveryType) {
            this.deliveryType = userInfo.deliveryType
          }
        })
    }
  }

  calculateTotal(): void {
    this.totalAmount = 0
    this.totalCount = 0
    if (this.card) {
      this.card.items.forEach(item => {
        this.totalAmount += item.quantity * item.product.price
        this.totalCount += item.quantity
      })
    }
  }

  changeDelivery(type: DeliveryType) {
    this.deliveryType = type
    this.updateDeliveryTypeValidator()
  }

  updateDeliveryTypeValidator() {
    if (this.deliveryType === DeliveryType.delivery) {
      this.orderForm.get('street')?.setValidators(Validators.required)
      this.orderForm.get('house')?.setValidators(Validators.required)
    } else {
      this.orderForm.get('street')?.removeValidators(Validators.required)
      this.orderForm.get('house')?.removeValidators(Validators.required)
      this.orderForm.get('street')?.setValue('')
      this.orderForm.get('house')?.setValue('')
      this.orderForm.get('entrance')?.setValue('')
      this.orderForm.get('apartment')?.setValue('')
    }

    this.orderForm.get('street')?.updateValueAndValidity()
    this.orderForm.get('house')?.updateValueAndValidity()
  }

  createOrder() {


    if (this.orderForm.valid &&
      this.orderForm.value.firstName &&
      this.orderForm.value.lastName &&
      this.orderForm.value.phone &&
      this.orderForm.value.paymentType &&
      this.orderForm.value.email
    ) {
      const paramsObject: OrderType = {
        deliveryType: this.deliveryType,
        firstName: this.orderForm.value.firstName,
        lastName: this.orderForm.value.lastName,
        phone: this.orderForm.value.phone,
        paymentType: this.orderForm.value.paymentType,
        email: this.orderForm.value.email,
      }

      if (this.deliveryType === DeliveryType.delivery) {
        if (this.orderForm.value.street) {
          paramsObject.street = this.orderForm.value.street
        }
        if (this.orderForm.value.apartment) {
          paramsObject.apartment = this.orderForm.value.apartment
        }
        if (this.orderForm.value.house) {
          paramsObject.house = this.orderForm.value.house
        }
        if (this.orderForm.value.entrance) {
          paramsObject.entrance = this.orderForm.value.entrance
        }
      }

      if (this.orderForm.value.comment) {
        paramsObject.comment = this.orderForm.value.comment
      }

      this.orderService.createOrder(paramsObject)
        .subscribe({
          next: (data: OrderType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message)
            }

            this.dialogRef = this.dialog.open(this.popup)
            this.dialogRef.backdropClick()
              .subscribe(() => {
                this.router.navigate(['/'])
              })
            this.cardService.setCount(0)
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message)
            } else {
              this._snackBar.open('Ошибка заказа')
            }
          }
        })

    } else {
      this.orderForm.markAllAsTouched()
      this._snackBar.open('Заполните необходимые поля')
    }

  }

  closePopup() {
    this.dialogRef?.close()
  }
}
