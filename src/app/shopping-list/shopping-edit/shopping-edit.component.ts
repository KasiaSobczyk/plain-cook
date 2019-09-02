import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from 'src/app/common/models/ingedient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) shoppingListForm: NgForm;
  editMode = false;
  itemSub: Subscription;
  ingredient: Ingredient;

  constructor(
    private store: Store<fromShoppingList.AppState>
  ) { }

  ngOnInit() {
    this.itemSub = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIdx > -1) {
        this.editMode = true;
        this.ingredient = stateData.editedIngredient;
        this.shoppingListForm.setValue({
          name: this.ingredient.name,
          amount: this.ingredient.amount
        });
      } else {
        this.editMode = false;
      }
    });
    // this.itemSub = this.shoppingListS.editItem.subscribe((index: number) => {
    //   this.editId = index;
    //   this.editMode = true;
    //   this.ingredient = this.shoppingListS.getIngredient(index);
    //   this.shoppingListForm.setValue({
    //     name: this.ingredient.name,
    //     amount: this.ingredient.amount
    //   });
    // });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newInredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newInredient));
      // this.shoppingListS.updateIngredient(this.editId, newInredient);
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newInredient));
      // this.shoppingListS.addIngrediendt(newInredient);
    }
    this.editMode = false;
    form.reset();
  }

  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    // this.shoppingListS.deleteIngredient(this.editId);
    this.onClear();
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  ngOnDestroy() {
    this.itemSub.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
