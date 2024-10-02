import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, tap} from "rxjs";
import {CardProductType} from "../../../types/card-product.type";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CardService {

  public count: number = 0
  count$: Subject<number> = new Subject<number>()

  constructor(private http: HttpClient) {
  }

  // {withCredentials: true} - Этот флаг нужно устанавливать при всех запросах которые работают сессиями
  getCard(): Observable<CardProductType> {
    return this.http.get<CardProductType>(environment.api + 'cart', {withCredentials: true})
  }

  getCardCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(environment.api + 'cart/count', {withCredentials: true})
      .pipe(
        tap(data => {
          this.count = data.count
          this.count$.next(data.count)
        })
      )

  }

  updateCard(productId: string, quantity: number): Observable<CardProductType> {
    return this.http.post<CardProductType>(environment.api + 'cart', {
      productId,
      quantity
    }, {withCredentials: true})
      .pipe(
        tap(data => {
          this.count = 0

          data.items.forEach(item => {
            this.count += item.quantity
          })
          this.count$.next(this.count)
        })
      )
  }
}
