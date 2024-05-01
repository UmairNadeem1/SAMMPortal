import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GetAllDevice } from 'app/models/devices/get-all-device';
import { ResponseData } from 'app/models/enum/request-type.enum';
import { AddUpdateDeviceComponent } from 'app/modules/device-management/add-update-device/add-update-device.component';
import { DeviceService } from 'app/modules/device-management/device.service';
import { RecipeService } from 'app/modules/recipeManagement/recipe.service';
import { LoaderService } from 'app/modules/shared/loader/loader.service';
import { SocketService } from 'app/modules/shared/socket/socket.service';
import { TeamManagmentService } from 'app/modules/teamManagment/teamManagment.service';
import * as Chartist from 'chartist';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription, finalize } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, OnDestroy {
  recipes;
  responsiveOptions;
  imageUrl = environment.imageBaseUrl;
  subscribtion:Subscription;
  devices:GetAllDevice[] = [];
  count:number = 0;
  constructor(private teamManagmentService:TeamManagmentService,
    private dialog: MatDialog,
    private deviceService:DeviceService,
    public loaderService: LoaderService,
    private recipeService:RecipeService,
    private toastr: ToastrService,
    private _socketService:SocketService) { 
      this.responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];
    }
  startAnimationForLineChart(chart){
      let seq: any, delays: any, durations: any;
      seq = 0;
      delays = 80;
      durations = 500;

      chart.on('draw', function(data) {
        if(data.type === 'line' || data.type === 'area') {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if(data.type === 'point') {
              seq++;
              data.element.animate({
                opacity: {
                  begin: seq * delays,
                  dur: durations,
                  from: 0,
                  to: 1,
                  easing: 'ease'
                }
              });
          }
      });

      seq = 0;
  };
  startAnimationForBarChart(chart){
      let seq2: any, delays2: any, durations2: any;

      seq2 = 0;
      delays2 = 80;
      durations2 = 500;
      chart.on('draw', function(data) {
        if(data.type === 'bar'){
            seq2++;
            data.element.animate({
              opacity: {
                begin: seq2 * delays2,
                dur: durations2,
                from: 0,
                to: 1,
                easing: 'ease'
              }
            });
        }
      });

      seq2 = 0;
  };
  items: any[] = []; // Your data source
  itemsPerRow = 5;
  currentIndex = 0;
  ngOnInit() {
    // this._socketService.connectSocket();
    this.GetDevice();
    
  }
  ngOnDestroy(): void {
    if(this.subscribtion){
      this.subscribtion.unsubscribe();
    }
  }

  GetUser(){
    this.loaderService.isLoading = true;
    this.teamManagmentService.GetUser({page:1,limit:1})
    .pipe(
        finalize(() => {
          this.loaderService.isLoading = false;
        })
    )
    .subscribe((res) => {
    });
  }

  GetRecipe(){
    this.loaderService.isLoading = true;
    this.recipeService.GetRecipe({page:1,limit:8})
    .pipe(
        finalize(() => {
          this.loaderService.isLoading = false
        })
    ).subscribe((res) => {
        if (res.success === true) {
          this.recipes = res.data;
          
          // this.dataSource =new MatTableDataSource(res.data);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
          // this.dataSource.paginator.length = res.data.total_records;
          // this.length = res.data[0].total_records;
          // this.toastr.success('Login Successfully','Success');
        } else { 
          this.recipes=[];
          // this.toastr.error(res.message);
           
        }
    });
  }


  getImages(recipePic){
    if (recipePic) {
        return recipePic;
    } else {
      return 'assets/img/ecipe.avif'; 
    }
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
      .GetDevice({ page: 1, limit: 5 })
      .pipe(
        finalize(() => {
          this.loaderService.isLoading = false;
        })
      )
      .subscribe((res:ResponseData<{result:GetAllDevice[],total_counts:number}>) => {
        console.log(res);
        if (res.success) {
          this.devices = res.data.result;
          this.subscribtion = this._socketService.listen('device-status').subscribe((data)=>{
            let index = this.devices.findIndex((x)=>x.device_serial === data.serial_number);
            if(index>-1) this.devices[index].device_status = 'Connected';
            
          })
        } else {
          // this.toastr.error("Something went wrong", "Failed");
        }
      });
  }

}
