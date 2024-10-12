import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'count-selector',
  templateUrl: './count-selector.component.html',
  styleUrls: ['./count-selector.component.scss']
})
export class CountSelectorComponent{

  @Input() count: number = 1
  @Output() countChange: EventEmitter<number> = new EventEmitter<number>()

  constructor() {
  }

  countChang() {
    this.countChange.emit(this.count)
  }

  decreaseCount() {
    if (this.count > 1) {
      this.count--
      this.countChang()
    }
  }

  increaseCount() {
    this.count++
    this.countChang()
  }

}
