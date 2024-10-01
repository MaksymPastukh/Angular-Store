import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderRoutingModule} from './order-routing.module';
import {CardComponent} from './card/card.component';
import {OrderComponent} from './order/order.component';
import {SharedModule} from "../../shared/shared.module";
import {CarouselModule} from "ngx-owl-carousel-o";

@NgModule({
  declarations: [
    CardComponent,
    OrderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    OrderRoutingModule,
    CarouselModule,
  ]
})
export class OrderModule {
}
