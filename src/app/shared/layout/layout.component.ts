import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../services/category.service";
import {CategoryWithTypeType} from "../../../types/category-with-type.type";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {

  public categories: CategoryWithTypeType[] = []

  constructor(private categoryServices: CategoryService) {
  }

  ngOnInit(): void {
    this.categoryServices.getCategoriesWithTypes()
      .subscribe((result: CategoryWithTypeType[]) => {
        this.categories = result.map(item => {
          return Object.assign(
            {
              typesUrl: item.types.map(typeUrl => typeUrl.url)
            }, item
          )
        })
      })
  }

}
