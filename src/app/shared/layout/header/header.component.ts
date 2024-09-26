import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {CategoryService} from "../../services/category.service";
import {CategoryType} from "../../../../types/category.type";
import {LayoutComponent} from "../layout.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input('category')
  public categories!: CategoryType[]

  constructor() {
  }

  ngOnInit(): void {
  }

}
