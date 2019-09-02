import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { RecipesComponent } from './recipes.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeRoutingModule } from './recipe-routing.module';
import { SharedModule } from '../common/shared.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [
    RecipesComponent,
    RecipeDetailComponent,
    RecipeListComponent,
    RecipeEditComponent,
    RecipeItemComponent,
    RecipeStartComponent
  ],
  imports: [
    RouterModule,
    ReactiveFormsModule,
    RecipeRoutingModule,
    SharedModule,
    BsDropdownModule
  ]
})
export class RecipesModule { }
