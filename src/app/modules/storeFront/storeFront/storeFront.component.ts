import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl } from "@angular/forms";
import { StoreFrontService } from "../storeFront.service";
import { finalize } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { LoaderService } from "app/modules/shared/loader/loader.service";
import { environment } from "environments/environment";
import { RecipeService } from "app/modules/recipeManagement/recipe.service";

export interface UserData {
  
  user_id: number;
  full_name: string;
  email: string;
  created_by:  string;
  role_id: number;
  role_name:string;
}

@Component({
  selector: "app-storeFront",
  templateUrl: "./storeFront.component.html",
  styleUrls: ["./storeFront.component.scss"],
})
export class StoreFrontComponent implements OnInit{
  
  ngOnInit() {
    this.GetRecipe();
  }

  searchSelect = new FormControl("");
  searchList: string[] = ["Name", "Email", "Phone Number", "Role"];
  length = 50;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];


  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.GetRecipe();
  }
  displayedColumns: string[] = [
            "recipe_id",
            "recipe_name",
            "recipe_description",
            "action",
            "cook",
  ];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog,
              private dialogRef: MatDialog,
              private recipeService:RecipeService,
              private toastr: ToastrService,
              public loaderService: LoaderService,) {
   
  }

   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  
  GetRecipe(){
    this.loaderService.isLoading = true;
    this.recipeService.GetRecipe({page:this.pageIndex+1,limit:this.pageSize})
    .pipe(
        finalize(() => {
          this.loaderService.isLoading = false
        })
    ).subscribe((res) => {
        if (res.success === true) {
          this.dataSource =new MatTableDataSource(res.data);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
          // this.dataSource.paginator.length = res.data.total_records;
          this.length = res.data[0].total_records;
          // this.toastr.success('Login Successfully','Success');
        } else { 
          this.toastr.error('Something went wrong','Failed');
           
        }
    });
  }

  addToCart(data){
    debugger
    let cart = [];
    if(localStorage.getItem("CartData")){
      cart = JSON.parse(localStorage.getItem("CartData"))
    }
    cart.push(data);
    localStorage.setItem("CartData",JSON.stringify(cart))
}

ifAdded(recipe_id){
  debugger
  if(!localStorage.getItem("CartData")){return true}
   const foundRecipe = JSON.parse(localStorage.getItem("CartData")).find(recipe => recipe.recipe_id === recipe_id);
   return !(!!foundRecipe);
}


}