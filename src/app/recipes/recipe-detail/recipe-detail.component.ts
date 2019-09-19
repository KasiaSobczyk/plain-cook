import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Recipe } from 'src/app/common/models/recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipes.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipeDetail: Recipe;
  recipeId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.route.params
      .pipe(
        map(params => {
          return +params['id'];
        }),
        switchMap(id => {
          this.recipeId = id;
          return this.store.select('recipes');
        }),
        map(recipeState => {
          return recipeState.recipes.find((recipe, index) => {
            return index === this.recipeId;
          });
        })
      )
      .subscribe(recipe => {
        this.recipeDetail = recipe;
      });
  }

  onAddToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipeDetail.ingredients));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onRemoveRecipe() {
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.recipeId));
    this.router.navigate(['/recipes']);
  }
}
