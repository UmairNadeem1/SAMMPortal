import { Routes } from "@angular/router";

import { DashboardComponent } from "../../dashboard/dashboard.component";
import { UserProfileComponent } from "../../user-profile/user-profile.component";
import { TableListComponent } from "../../table-list/table-list.component";
import { TypographyComponent } from "../../typography/typography.component";
import { IconsComponent } from "../../icons/icons.component";
import { MapsComponent } from "../../maps/maps.component";
import { NotificationsComponent } from "../../notifications/notifications.component";
import { UpgradeComponent } from "../../upgrade/upgrade.component";
import { AdminLayoutComponent } from "./admin-layout.component";
import { AuthGuard } from "app/guards/auth.guard";

export const AdminLayoutRoutes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "dashboard",
  },
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate:[AuthGuard],
    canActivateChild:[AuthGuard],
    children: [
      { path: "dashboard", component: DashboardComponent },
      // { path: "user-profile", component: UserProfileComponent },
      // { path: "table-list", component: TableListComponent },
      // { path: "typography", component: TypographyComponent },
      // { path: "icons", component: IconsComponent },
      // { path: "maps", component: MapsComponent },
      // { path: "notifications", component: NotificationsComponent },
      // { path: "upgrade", component: UpgradeComponent },
      // {
      //   path: "teamManagment",
      //   loadChildren: () =>
      //     import("../../modules/teamManagment/teamManagment.module").then(
      //       (m) => m.TeamManagmentModule
      //     ),
      // },
      {
        path: "recipeManagement",
        loadChildren: () =>
          import("../../modules/recipeManagement/recipe.module").then(
            (m) => m.RecipeModule
          ),
      },
      {
        path: "device-management",
        loadChildren: () =>
          import(
            "../../modules/device-management/device-management.module"
          ).then((m) => m.DeviceManagementModule),
      },
      {
        path: "store-front",
        loadChildren: () =>
          import(
            "../../modules/storeFront/storeFront.module"
          ).then((m) => m.StoreFrontModule),
      },
    ],
  },
];
