
import { TeamManagmentRoutingModule } from "./teamManagment-routing.module";
import { TeamManagmentComponent } from "./teamManagment/teamManagment.component";
import { SharedModule } from "../shared/shared.module";
import { AddUserComponent } from "./add-user/add-user.component";
import { LOCALE_ID, NgModule } from "@angular/core";
const lang = "en-US";
@NgModule({
  declarations: [TeamManagmentComponent, 
                  AddUserComponent
  ],
  imports: [
    TeamManagmentRoutingModule,
    SharedModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: lang }],
})
export class TeamManagmentModule {}
