import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PasswordRepeatDirective} from "./directive/password-repeat.directive";
import { ProductCardComponent } from './components/product-card/product-card.component';
import {RouterLinkWithHref, RouterModule} from "@angular/router";


@NgModule({
  declarations: [
    PasswordRepeatDirective,
    ProductCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterLinkWithHref
  ],
  exports: [
    PasswordRepeatDirective,
    ProductCardComponent
  ]
})
export class SharedModule {
}
