import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { LayoutService } from './service/layout.service';
import { GraphqlService } from './service/graphql.service';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationError,
} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy, DoCheck {
  title = 'angular-app';
  mediaSub: Subscription;
  loginSuccess = false;
  fname = 'M';
  lname = 'A';

  constructor(
    private mediaObserver: MediaObserver,
    private layoutService: LayoutService,
    private gqlServ: GraphqlService,
    private router: Router
  ) {}
  ngDoCheck(): void {
    this.loginSuccess = this.gqlServ.isLoginSuccessful;
    if (this.gqlServ.logingUser) {
      this.fname = this.gqlServ.logingUser.fname;
      this.lname = this.gqlServ.logingUser.lname;
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
      }

      if (event instanceof NavigationEnd) {
        if (this.gqlServ.logingUser == undefined && this.router.url != '/') {
          this.gqlServ.isLoginSuccessful = false;
          this.loginSuccess = this.gqlServ.isLoginSuccessful;
          this.gqlServ.logingUser = undefined;
          this.router.navigate(['/']);
        }
      }

      if (event instanceof NavigationError) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.gqlServ.isLoginSuccessful = false;
    this.loginSuccess = this.gqlServ.isLoginSuccessful;
  }

  logOut() {
    this.gqlServ.isLoginSuccessful = false;
    this.loginSuccess = this.gqlServ.isLoginSuccessful;
    this.gqlServ.logingUser = undefined;
    this.router.navigate(['/']);
  }
}
