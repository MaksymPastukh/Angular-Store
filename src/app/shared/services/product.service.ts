import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductType} from "../../../types/product.type";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {
  }

  public getBestProduct(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(environment.api + 'products/best')
  }

  public getProducts(): Observable<{ totalCount: number, pages: number, items: ProductType[] }> {
    return this.http.get<{ totalCount: number, pages: number, items: ProductType[] }>(environment.api + 'products')
  }
}
