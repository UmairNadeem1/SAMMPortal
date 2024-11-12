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
declare var webkitSpeechRecognition;
export interface UserData {
  user_id: number;
  full_name: string;
  email: string;
  created_by: string;
  role_id: number;
  role_name: string;
}

@Component({
  selector: "app-storeFront",
  templateUrl: "./storeFront.component.html",
  styleUrls: ["./storeFront.component.scss"],
})
export class StoreFrontComponent implements OnInit {
  ngOnInit() {
    this.GetRecipe();
    this._storeFrontService.isRefresh.subscribe((resp) => {
      if (resp) {
        this.GetRecipe();
      }
    });
  }

  searchSelect = new FormControl("");
  searchList: string[] = ["Name", "Email", "Phone Number", "Role"];
  length = 50;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  startVoiceSearch() {
    // let voiceHandler = this.hiddenSearchHandler?.nativeElement;
    if ("webkitSpeechRecognition" in window) {
      const vSearch = new webkitSpeechRecognition();
      vSearch.continuous = false;
      vSearch.interimresults = false;
      vSearch.lang = "en-US";
      vSearch.start();
      vSearch.onresult = (e) => {
        console.log(e);
        this.item = e.results[0][0].transcript;
        vSearch.stop();
      };
    } else {
      alert("Your browser does not support voice recognition!");
    }
  }

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
  item: string = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialog,
    private recipeService: RecipeService,
    private toastr: ToastrService,
    private _storeFrontService: StoreFrontService,
    public loaderService: LoaderService
  ) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  searchRecipe() {
    this.pageIndex = 0;
    this.GetRecipe();
  }
  GetRecipe() {
    this.loaderService.isLoading = true;
    this.recipeService
      .GetStoreRecipe({
        page: this.pageIndex + 1,
        limit: this.pageSize,
        ...(this.item) && {
          filter: JSON.stringify(
            {
              recipe_name : this.item
            }
          )
        }
      })
      .pipe(
        finalize(() => {
          this.loaderService.isLoading = false;
        })
      )
      .subscribe((res) => {
        if (res.success === true) {
          this.dataSource = new MatTableDataSource(res.data);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
          // this.dataSource.paginator.length = res.data.total_records;
          // this.length = res.data[0].total_records;
          // this.toastr.success('Login Successfully','Success');
        } else {
          this.dataSource = new MatTableDataSource([]);
        }
      });
  }

  addToCart(data) {
    
    let cart = [];
    if (localStorage.getItem("CartData")) {
      cart = JSON.parse(localStorage.getItem("CartData"));
    }
    cart.push(data);
    localStorage.setItem("CartData", JSON.stringify(cart));
  }

  ifAdded(recipe_id) {
    
    if (!localStorage.getItem("CartData")) {
      return true;
    }
    const foundRecipe = JSON.parse(localStorage.getItem("CartData")).find(
      (recipe) => recipe.recipe_id === recipe_id
    );
    return !!!foundRecipe;
  }
}
