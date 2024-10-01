import {Component, Input, OnInit} from '@angular/core';
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtils} from "../../utils/active-params.utils";

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
  public from: number | null = null // Переменная для хранения значения с фильтров
  public to: number | null = null // Переменная для хранения значения с фильтров

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

  constructor(private router: Router, private activateRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    //Делаем подписку на (url)
    //В этой функции каждый раз когда наши параметры url изменятся мы будем получать их

    this.activateRoute.queryParams.subscribe((params: Params) => {
        this.activeParams = ActiveParamsUtils.processParams(params)

        if (this.type) {
          if (this.type === 'height') {
            this.open = !!(this.activeParams.heightFrom || this.activeParams.heightTo)
            this.from = this.activeParams.heightFrom ? +this.activeParams.heightFrom : null
            this.to = this.activeParams.heightTo ? +this.activeParams.heightTo : null
          } else if (this.type === 'diameter') {
            this.open = !!(this.activeParams.diameterFrom || this.activeParams.diameterTo)
            this.from = this.activeParams.diameterFrom ? +this.activeParams.diameterFrom : null
            this.to = this.activeParams.diameterTo ? +this.activeParams.diameterTo : null
          }
        } else {
          if (params['types']) {
            this.activeParams.types = Array.isArray(params['types']) ? params['types'] : [params['types']]
          }

          if (this.categoryTypes &&
            this.categoryTypes.types &&
            this.categoryTypes.types.length > 0 &&
            this.categoryTypes.types.some(type =>
              this.activeParams.types.find(item => type.url === item))) {
            this.open = true
          }
        }
      }
    )
  }

  toggle(): void {
    this.open = !this.open
  }

  // Метод для добавления/обновления параметров фильтрации каталогов в url
  updateFilterParam(url
                      :
                      string, checked
                      :
                      boolean
  ) {
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
        this.activeParams.types = [...this.activeParams.types, url]
      }
    } else if (checked) {
      // Если у нас в activeParams.types пустой массив и активный checkbox.
      // Добавляем url в activeParams.types
      this.activeParams.types = [url]
    }

    //Когда мы будем вызывать этот метод в параметры мы будем передавать не то новое свойство которе нам нужно обновить
    this.activeParams.page = 1
    this.router.navigate(['/catalog'], {
      //А просто будем искать его в нашем объекте где мы храним все свойства и либо его удалять или добавлять
      queryParams: this.activeParams
    })
  }

  // Метод для добавления/обновления параметров фильтрации высоты и диаметра в url
  updateFilterParamFromTo(param
                            :
                            string, value
                            :
                            string
  ):
    void {
    if (param === 'heightTo' || param === 'heightFrom' || param === 'diameterTo' || param === 'diameterFrom'
    ) {
      if (this.activeParams[param] && !value) {
        delete this.activeParams[param]
      } else {
        this.activeParams[param] = value
      }

      this.activeParams.page = 1
      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams
      })
    }
  }
}
