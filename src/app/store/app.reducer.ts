import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../user/store/auth.reducer';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromRecipes from '../recipes/store/recipes.reducer';

export interface AppState {
  auth: fromAuth.State;
  shoppingList: fromShoppingList.State;
  recipes: fromRecipes.State;
}

export const AppReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  shoppingList: fromShoppingList.shoppingListReducer,
  recipes: fromRecipes.RecipesReducer
};
