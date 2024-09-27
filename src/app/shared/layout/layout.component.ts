import { Component, OnInit } from '@angular/core';
import {CategoryType} from "../../../types/category.type";
import {CategoryService} from "../services/category.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {

  public categories: CategoryType[] = []

  constructor(private categoryServices: CategoryService) { }

  ngOnInit(): void {
    this.categoryServices.getCategories()
      .subscribe((result: CategoryType[]) => {
        this.categories = result
      })
  }

  getCategories() {
    return this.categories
  }

}
