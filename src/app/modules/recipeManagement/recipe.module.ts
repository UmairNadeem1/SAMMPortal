import { NgModule, LOCALE_ID } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { AddRecipeComponent } from "./add-recipe/add-recipe.component";
import { RecipeComponent } from "./recipe-list/recipe.component";
import { RecipeModuleRoutingModule } from "./recipe-routing.module";
import { PriceRecipeComponent } from "./price-recipe/price-recipe.component";
import { CookNowComponent } from './cook-now/cook-now.component';


const lang = "en-US";
@NgModule({
  declarations: [
    AddRecipeComponent,
    RecipeComponent,
    PriceRecipeComponent,
    CookNowComponent
  ],
  imports: [
    RecipeModuleRoutingModule,
    SharedModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: lang }],
})
export class RecipeModule {}
