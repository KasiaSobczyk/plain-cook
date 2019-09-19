import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Ingredient } from '../common/models/ingedient.model';
import * as fromApp from '../store/app.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  // ingredients: Observable<{ ingredients: Ingredient[]}>;
  ingredients: Ingredient[];

  constructor(
    private store: Store<fromApp.AppState>
    ) { }

  ngOnInit() {
    this.store.select('shoppingList').subscribe( res => {
      console.log("shoppingList  ",res);
      this.ingredients = res.ingredients;
    });
    // this.ingredients = this.shoppingList.getIngrediednts();
    // this.shoppingList.newItemAdded.subscribe(
    //   (items: Ingredient[]) => {
    //     this.ingredients = items;
    //   }
    // );
  }

  editIngredient(id: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(id));
    // this.shoppingList.editItem.next(id);
  }
}
