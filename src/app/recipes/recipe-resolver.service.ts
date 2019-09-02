import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { StorageDataService } from '../common/storage-data.service';
import { Recipe } from '../common/models/recipe.model';
import { RecipeService } from './recipe.service';

@Injectable({ providedIn: 'root' })
export class RecipeResolverService implements Resolve<Recipe[]> {
  constructor(
    private recipeService: RecipeService,
    private storageService: StorageDataService
    ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const recipes = this.recipeService.getRecipes();

    if (recipes.length === 0) {
      return this.storageService.fetchData();
    } else {
      return recipes;
    }
  }
}
