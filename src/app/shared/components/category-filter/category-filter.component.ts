import {Component, Input, OnInit} from '@angular/core';
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {iterator} from "rxjs/internal/symbol/iterator";

@Component({
  selector: 'category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent implements OnInit {

  //Так как у нас здесь два Input, если компонент работает с категориями то он будет принимать categoryTypes
  //Если компонент работает с числами От и До, то он будет принимать type
  @Input() categoryTypes: CategoryWithTypeType | null = null
  @Input() type: string | null = null  // Будет принимать ширину или высоту

  //Создаем переменную для проверки состояния фильтра, открыт / закрыт
  open: boolean = false

  //Создаем спец обьект в котором будем хранить актуальное состояния активных параметров. С которыми и будем работать в фильтрах товаров
  public activeParams: ActiveParamsType = {
    types: []
  }


  // В этом гетере определяю какой тип данных приходит в компонент и под этот тип устанавливаем title фильтра
  get title(): string {
    if (this.categoryTypes) {
      return this.categoryTypes.name
    } else if (this.type) {
      if (this.type === 'height') {
        return 'Высота'
      } else if (this.type === 'diameter') {
        return 'Диаметр'
      }
    }

    return ''
  }

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  toggle(): void {
    this.open = !this.open
  }

  // Метод для добавления/обновления параметров фильтрации в url
  updateFilterParam(url: string, checked: boolean) {
    // Функционал добавления и удаления актуального состояния активных параметров с activeParams
    if (this.activeParams.types && this.activeParams.types.length > 0) {
      // Если в activeParams есть значения, то мы проверяем не равны ли те значения которые мы выбрали в url и возвращаем их
      const existingTypeInParams = this.activeParams.types.find(item => item === url)
      if (existingTypeInParams && !checked) {
        // Если этот url есть и мы его получили в existingTypeInParams и checkbox не активный
        // Мы удаляем этот элемент из обьекта activeParams используя метод filter возвращаем новый массив
        this.activeParams.types = this.activeParams.types.filter(item => item !== url)
      } else if (!existingTypeInParams && checked) {
        // Если в existingTypeInParams нету url и checkbox активный, то мы его добавляем url в activeParams
        this.activeParams.types.push(url)
      }
    } else if(checked) {
      // Если у нас в activeParams.types пустой массив и активный checkbox.
      // Добавляем url в activeParams.types
      this.activeParams.types = [url]
    }

    console.log(this.activeParams.types)

    //Когда мы будем вызывать этот метод в параметры мы будем передавать не то новое свойство которе нам нужно обновить
    this.router.navigate(['/catalog'], {
      //А просто будем искать его в нашем объекте где мы храним все свойства и либо его удалять или добавлять
      queryParams: this.activeParams
    })
  }

}
