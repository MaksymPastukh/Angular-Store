import {ActiveParamsType} from "../../../types/active-params.type";
import {Params} from "@angular/router";

export class ActiveParamsUtils {
  static processParams(params: Params ) : ActiveParamsType {
//Именно здесь мы будем устанавливать те параметры которые получили и которые на данный момент есть в url адресе
    //В обьект activeParams
    const activeParams: ActiveParamsType = {types: []} // Здесь будем устанавливать необходимые ключи исходя из того что у нас находится в массиве params

    if (params.hasOwnProperty('types')) {
      activeParams.types = Array.isArray(params['types']) ? params['types'] : [params['types']]
    }

    if (params.hasOwnProperty('heightTo')) {
      activeParams.heightTo = params['heightTo']
    }

    if (params.hasOwnProperty('heightFrom')) {
      activeParams.heightFrom = params['heightFrom']
    }

    if (params.hasOwnProperty('diameterTo')) {
      activeParams.diameterTo = params['diameterTo']
    }

    if (params.hasOwnProperty('diameterFrom')) {
      activeParams.diameterFrom = params['diameterFrom']
    }

    if (params.hasOwnProperty('sort')) {
      activeParams.sort = params['sort']
    }

    if (params.hasOwnProperty('page')) {
      activeParams.page = params['page']
    }

    return activeParams
  }
}
