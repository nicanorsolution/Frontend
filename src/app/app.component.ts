import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { BnNgIdleService } from 'bn-ng-idle';
import {  Router } from '@angular/router';
import { AuthService } from './content/users/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(public location: Location, private route: Router, private bnIdle: BnNgIdleService, private authService: AuthService) {}

  // TODO set the idle time to 15 min
 ngOnInit(){
   this.bnIdle.startWatching(3600).subscribe((isTimedOut: boolean) => {
     if (isTimedOut) {
       console.log('session expired');
       this.authService.logout().subscribe();
       this.route.navigateByUrl('/');
     }
   });
 }

 isMap(path: string){
   var titlee = this.location.prepareExternalUrl(this.location.path());
   titlee = titlee.slice( 1 );
   if(path == titlee){
     return false;
   }
   else {
     return true;
   }
 }
}
