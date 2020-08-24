import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { Router, ActivatedRoute } from '@angular/router';

import {
  ViewContainerRef,
  ComponentFactoryResolver,
  Type,
  Injector,
} from '@angular/core';
import { WorkEntryComponent } from '../work-entry/work-entry.component';
import { DataService, GraphqlService } from '../../service/graphql.service';

export class MyErrorStateMatcher {}

@Component({
  selector: 'app-emp-details',
  templateUrl: './work-details.component.html',
  styleUrls: ['./work-details.component.css'],
})
export class WorkDetailsComponent implements OnInit, AfterContentChecked {
  ErrorMsg: any;
  testField = '';
  actionButton;
  selectedIndex = 0;
  isDisabled = false;

  title = 'lazyComp';
  lazyCom: Promise<Type<WorkEntryComponent>>[] = [
    undefined,
    undefined,
    undefined,
    undefined,
  ];
  lazyInjector: Injector[] = [undefined, undefined, undefined, undefined];
  data: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private viewContainerRef: ViewContainerRef,
    private cfr: ComponentFactoryResolver,
    private dataServise: DataService,
    private injector: Injector,
    private gqlServ: GraphqlService
  ) {}

  async load(tab) {
    console.log('in load tab index - ', tab);

    if (!this.lazyCom[tab]) {
      this.data = 'Some data';
      console.log(this.data, tab);
      this.lazyInjector[tab] = Injector.create({
        providers: [
          {
            provide: 'childComp',
            useValue: this.data,
          },
        ],
        parent: this.injector,
      });
      this.lazyCom[tab] = import('../work-entry/work-entry.component').then(
        ({ WorkEntryComponent }) => WorkEntryComponent
      );
    }
  }

  ngAfterContentChecked(): void {
    if (
      this.route.snapshot.paramMap.get('action') === 'edit' ||
      this.route.snapshot.paramMap.get('action') === 'view'
    ) {
      this.isDisabled = true;
    }
  }

  ngOnInit(): void {}

  onSubmit(data) {}

  displayCounter(recId) {
    this.selectedIndex = 1;
  }

  matcher = new MyErrorStateMatcher();

  onChange(event: MatTabChangeEvent) {
    const tab = event.tab.textLabel;
    //this.gqlServ.GlobalTabIndex = 0;
    // if (event.tab.textLabel !== 'Tab 1') {
    //   console.log(event.tab);
    //   this.load(event.tab.textLabel);
    // }
    console.log(tab);
    switch (event.tab.textLabel) {
      case 'Tab 1': {
        this.gqlServ.GlobalTabIndex = 0;
        console.log('cccc', this.gqlServ.GlobalTabIndex);
        break;
      }
      case 'Tab 2': {
        this.load(1);
        this.gqlServ.GlobalTabIndex = 1;
        break;
      }
      case 'Tab 3': {
        this.load(2);
        this.gqlServ.GlobalTabIndex = 2;
        break;
      }
      case 'Tab 4': {
        this.load(3);
        this.gqlServ.GlobalTabIndex = 3;
        break;
      }
    }
  }
}
