import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from './models/recipe.model';
import { AuthService } from '../user/auth.service';

@Injectable({ providedIn: 'root' })
export class StorageDataService {

  firebase = 'https://plain-cook.firebaseio.com/';

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

  storeData() {
    const recipes = this.recipeService.getRecipes();
    this.http
    .put(this.firebase + 'recipes.json', recipes)
    .subscribe(res => {
      console.log(res);
    });
  }

  fetchData() {
    return this.http
    .get<Recipe[]>(this.firebase + 'recipes.json')
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
