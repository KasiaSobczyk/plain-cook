import { Ingredient } from '../../common/models/ingedient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIdx: number;
}

const initialState: State = {
  ingredients: [new Ingredient('Apple', 5), new Ingredient('Juice', 1)],
  editedIngredient: null,
  editedIngredientIdx: -1
};

export function shoppingListReducer(
  state: State = initialState,
  action: ShoppingListActions.ShoppingListActions
) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      };
    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[state.editedIngredientIdx];
      const updatedIngredient = {
        ...ingredient,
        ...action.payload
      };
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIdx] = updatedIngredient;
      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredient: null,
        editedIngredientIdx: -1
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((item, idx) => {
          return idx !== state.editedIngredientIdx;
        }),
        editedIngredient: null,
        editedIngredientIdx: -1
      }
    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngredientIdx: action.payload,
        editedIngredient: { ...state.ingredients[action.payload] }
      };
    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredientIdx: -1,
        editedIngredient: null
      }
    default:
      return state;
  }
}
