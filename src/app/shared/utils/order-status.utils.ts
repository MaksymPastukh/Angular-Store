import {OrdersStatusType} from "../../../types/orders-status.type";

export class OrderStatusUtils {
  static getStatusAndColor(status: OrdersStatusType | undefined | null): { name: string, color: string } {

    let name: string = 'Новый'
    let color: string = '#456f49'

    switch (status) {
      case OrdersStatusType.delivery :
        name = 'Доставка'
        break;
      case OrdersStatusType.cancelled :
        name = 'Отменён'
        color = '#ff7575'
        break;
      case OrdersStatusType.pending :
        name = 'Обработка'
        break;
      case OrdersStatusType.success :
        name = 'Выполнен'
        color = '#b6d5b9'
        break;
    }

    return {name, color}
  }
}
