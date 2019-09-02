import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { Recipe } from '../common/models/recipe.model';
import { Ingredient } from '../common/models/ingedient.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';


@Injectable()
export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];

  constructor(private store: Store<fromShoppingList.AppState>) { }


  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  getRecipes() {
    return this.recipes.slice();
  }

  addToShoppingList(items: Ingredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(items));
    // this.shoppingListService.addItemsToList(items);
  }

  addRecipe(item: Recipe) {
    this.recipes.push(item);
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(id: number, item: Recipe) {
    this.recipes[id] = item;
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(id: number) {
    this.recipes.splice(id, 1);
    this.recipeChanged.next(this.recipes.slice());
  }
}
