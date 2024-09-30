import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {CategoryType} from "../../../../types/category.type";
import {LayoutComponent} from "../layout.component";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit{

  @Input('category')
  public categories!: CategoryType[]

  constructor() {}

  ngOnInit(): void {}

}
