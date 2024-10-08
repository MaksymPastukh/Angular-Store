import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderRoutingModule} from './order-routing.module';
import {CardComponent} from './card/card.component';
import {OrderComponent} from './order/order.component';
import {SharedModule} from "../../shared/shared.module";
import {CarouselModule} from "ngx-owl-carousel-o";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
  declarations: [
    CardComponent,
    OrderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MatDialogModule,
    OrderRoutingModule,
    CarouselModule,
  ]
})
export class OrderModule {
}
