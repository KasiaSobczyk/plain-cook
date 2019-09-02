import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  get controls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
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
      const editedRecipe = this.recipeService.getRecipe(this.id);
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
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDeleteIngrediednt(id: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(id);
  }
}
