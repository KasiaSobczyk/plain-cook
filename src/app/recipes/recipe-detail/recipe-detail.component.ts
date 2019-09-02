import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { RecipeService } from '../recipe.service';
import { Recipe } from 'src/app/common/models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipeDetail: Recipe;
  recipeId: number;

  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.recipeId = +params['id'];
        this.recipeDetail = this.recipeService.getRecipe(this.recipeId);
      }
    );
  }

  onAddToShoppingList() {
    this.recipeService.addToShoppingList(this.recipeDetail.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onRemoveRecipe() {
    this.recipeService.deleteRecipe(this.recipeId);
    this.router.navigate(['/recipes']);
  }
}
