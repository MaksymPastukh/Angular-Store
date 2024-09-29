import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {CategoryType} from "../../../types/category.type";
import {environment} from "../../../environments/environment";
import {TypeType} from "../../../types/type.type";
import {CategoryWithTypeType} from "../../../types/category-with-type.type";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {
  }

  getCategories(): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(environment.api + 'categories')
  }

  getCategoriesWithTypes(): Observable<CategoryWithTypeType[]> {
    return this.http.get<TypeType[]>(environment.api + 'types')
      .pipe(     // Делаем промежуточную обработку результата, что бы получить данные описанные в CategoryWithTypeType в не весь TypeType
        map((item: TypeType[]) => {
          const array: CategoryWithTypeType[] = []


          item.forEach((item: TypeType) => {
            // Логика состоит в том что мы проверяем совпадает ли URL категории с URL типом, если да то мы добавляем этот тип к той категории в которой URL равны
            const findItem: CategoryWithTypeType | undefined = array.find((arrayItem: CategoryWithTypeType): boolean => arrayItem.url === item.category.url)

            if (findItem) {
              // Если findItem не undefined а true
              // Добавляем найденные типы к соответствующим категориям
              findItem.types.push({
                id: item.id,
                name: item.name,
                url: item.url
              })
            } else {
              // Если findItem undefined
              // Естественно это будет срабатывать когда мы найдем первую категорию встречную которой еще не было в нашем массиве
              array.push({
                id: item.category.id,
                name: item.category.name,
                url: item.category.url,
                types: [{
                  id: item.id,
                  name: item.name,
                  url: item.url
                }]
              })
            }
          })

          return array
        })
      )
  }
}
