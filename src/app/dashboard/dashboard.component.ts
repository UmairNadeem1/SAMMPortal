import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GetAllDevice } from 'app/models/devices/get-all-device';
import { ResponseData } from 'app/models/enum/request-type.enum';
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
  constructor(private teamManagmentService:TeamManagmentService,
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
    this.GetDevice();
    
      /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */
      // this.GetRecipe();
      // this.GetUser();
    //   const dataDailySalesChart: any = {
    //       labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    //       series: [
    //           [12, 17, 7, 17, 23, 18, 38]
    //       ]
    //   };

    //  const optionsDailySalesChart: any = {
    //       lineSmooth: Chartist.Interpolation.cardinal({
    //           tension: 0
    //       }),
    //       low: 0,
    //       high: 50, // SAMM: we recommend you to set the high sa the biggest value + something for a better look
    //       chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
    //   }

    //   var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

    //   this.startAnimationForLineChart(dailySalesChart);


    //   /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

    //   const dataCompletedTasksChart: any = {
    //       labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
    //       series: [
    //           [230, 750, 450, 300, 280, 240, 200, 190]
    //       ]
    //   };

    //  const optionsCompletedTasksChart: any = {
    //       lineSmooth: Chartist.Interpolation.cardinal({
    //           tension: 0
    //       }),
    //       low: 0,
    //       high: 1000, // SAMM: we recommend you to set the high sa the biggest value + something for a better look
    //       chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
    //   }

    //   var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

    //   // start animation for the Completed Tasks Chart - Line Chart
    //   this.startAnimationForLineChart(completedTasksChart);



    //   /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

    //   var datawebsiteViewsChart = {
    //     labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    //     series: [
    //       [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

    //     ]
    //   };
    //   var optionswebsiteViewsChart = {
    //       axisX: {
    //           showGrid: false
    //       },
    //       low: 0,
    //       high: 1000,
    //       chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
    //   };
    //   var responsiveOptions: any[] = [
    //     ['screen and (max-width: 640px)', {
    //       seriesBarDistance: 5,
    //       axisX: {
    //         labelInterpolationFnc: function (value) {
    //           return value[0];
    //         }
    //       }
    //     }]
    //   ];
    //   var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

    //   //start animation for the Emails Subscription Chart
    //   this.startAnimationForBarChart(websiteViewsChart);
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
          this.recipes =res.data;
          
          // this.dataSource =new MatTableDataSource(res.data);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
          // this.dataSource.paginator.length = res.data.total_records;
          // this.length = res.data[0].total_records;
          // this.toastr.success('Login Successfully','Success');
        } else { 
          this.toastr.error('Something went wrong','Failed');
           
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
          this._socketService.connectSocket();
          this.subscribtion = this._socketService.devicStatus.subscribe((data)=>{
            let index = this.devices.findIndex((x)=>x.device_serial === data.serial_number);
            if(index>-1) this.devices[index].device_status = 'Connected';
            // this._socketService.cookNow()
          })
        } else {
          // this.toastr.error("Something went wrong", "Failed");
        }
      });
  }

}
