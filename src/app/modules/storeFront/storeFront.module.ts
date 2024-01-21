
import { StoreFrontComponent } from "./storeFront/storeFront.component";
import { SharedModule } from "../shared/shared.module";
import { LOCALE_ID, NgModule } from "@angular/core";
import { StoreFrontRoutingModule } from "./storeFront-routing.module";
const lang = "en-US";
@NgModule({
  declarations: [StoreFrontComponent, 
  ],
  imports: [
    StoreFrontRoutingModule,
    SharedModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: lang }],
})
export class StoreFrontModule {}
