import {Component, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  public favoriteProducts: FavoriteType[] = []
  public serverStaticPath = environment.serverStaticPath


  constructor(private favoriteService: FavoriteService) {
  }

  ngOnInit(): void {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error: string = (data as DefaultResponseType).message
          throw new Error(error)
        }
        this.favoriteProducts = data as FavoriteType[]
      })
  }

  removeFromFavorites(id: string) {

  }

}
