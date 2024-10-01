import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CardComponent} from "./card/card.component";
import {OrderComponent} from "./order/order.component";

const routes: Routes = [
  {path: 'card', component: CardComponent},
  {path: 'order', component: OrderComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
