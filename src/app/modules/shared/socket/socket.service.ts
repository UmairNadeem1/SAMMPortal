import { Injectable } from '@angular/core';
import { AuthService } from 'app/modules/auth/auth.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
import {io} from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;
  public devicStatus:Subject<any> = new Subject();
  constructor(private _authService:AuthService) { }
  connectSocket(){
    this.socket = io(environment.socketUrl + '?access_token='+this._authService?.getUser?.accessToken);
    this.getDeviceStatus();
  }
  getDeviceStatus(){
    this.socket.on('device-status',(data)=>{
      this.devicStatus.next(JSON.parse(data));
    })
  }
}
