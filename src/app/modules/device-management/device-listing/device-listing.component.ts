import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DeviceService } from "../device.service";
import { ToastrService } from "ngx-toastr";
import { LoaderService } from "app/modules/shared/loader/loader.service";
import { finalize } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { AddUpdateDeviceComponent } from "../add-update-device/add-update-device.component";
import { ResponseData } from "app/models/enum/request-type.enum";

@Component({
  selector: "app-device-listing",
  templateUrl: "./device-listing.component.html",
  styleUrls: ["./device-listing.component.scss"],
})
export class DeviceListingComponent implements OnInit {
  length = 50;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    "device_id",
    "device_name",
    "device_serial",
    "owner",
    "action",
  ];
  constructor(
    private dialog: MatDialog,
    private deviceService: DeviceService,
    private toastr: ToastrService,
    public loaderService: LoaderService
  ) {}
  ngOnInit(): void {
    this.GetDevice();
  }
  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.GetDevice();
  }
  AddUpdateDevice(data = null) {
    const dialogRef = this.dialog.open(AddUpdateDeviceComponent, {
      width: "70%",
      height: "auto",
      data: data,
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data === true) {
        this.GetDevice();
      }
    });
  }
  GetDevice() {
    this.loaderService.isLoading = true;
    this.deviceService
      .GetDevice({ page: this.pageIndex + 1, limit: this.pageSize })
      .pipe(
        finalize(() => {
          this.loaderService.isLoading = false;
        })
      )
      .subscribe((res:ResponseData<{result:[],total_counts:number}>) => {
        console.log(res);
        if (res.success) {
          this.dataSource = new MatTableDataSource(res.data.result);
          this.length = res.data.total_counts;
        } else {
          // this.toastr.error("Something went wrong", "Failed");
        }
      });
  }
}
