import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';

import * as RecipesAction from './recipes.actions';
import { Recipe } from 'src/app/common/models/recipe.model';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';


@Injectable()
export class RecipesEffects {
  @Effect()
  fetchData = this.actions$.pipe(
    ofType(RecipesAction.FETCH_RECIPES),
    switchMap(() => {
      return this.http
        .get<Recipe[]>('https://plain-cook.firebaseio.com/recipes.json');
    }),
    map(recipes => {
      return recipes.map(recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        };
      });
    }),
    map(recipes => {
      return new RecipesAction.SetRecipes(recipes);
    })
  );

  @Effect({ dispatch: false })
  storeData = this.actions$.pipe(
    ofType(RecipesAction.STORE_DATA),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http
        .put('https://plain-cook.firebaseio.com/recipes.json', recipesState.recipes);
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) { }
}
