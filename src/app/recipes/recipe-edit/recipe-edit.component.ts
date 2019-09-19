import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipes.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  private storeSub: Subscription;

  get controls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }

  private initForm() {
    let initName = '';
    let initPath = '';
    let initDsc = '';
    let ingredientsArray = new FormArray([]);

    if (this.editMode) {
      this.storeSub = this.store.select('recipes').pipe(
        map(recipeState => {
          return recipeState.recipes.find((recipe, index) => {
            return index === this.id;
          });
        })
      ).subscribe(editedRecipe => {
        initName = editedRecipe.name;
        initPath = editedRecipe.imagePath;
        initDsc = editedRecipe.description;
        if (editedRecipe['ingredients']) {
          for (let item of editedRecipe.ingredients) {
            ingredientsArray.push(
              new FormGroup({
                name: new FormControl(item.name, Validators.required),
                amount: new FormControl(item.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
              })
            );
          }
        }
      });
    }
    this.recipeForm = new FormGroup({
      name: new FormControl(initName, Validators.required),
      imagePath: new FormControl(initPath, Validators.required),
      description: new FormControl(initDsc, Validators.required),
      ingredients: ingredientsArray
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.store.dispatch(new RecipesActions.UpdateRecipe({ id: this.id, newRecipe: this.recipeForm.value }));
    } else {
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value));
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDeleteIngrediednt(id: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(id);
  }

  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
