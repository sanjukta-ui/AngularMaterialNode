import { Injectable } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { WorkSystem } from '../model/work-model';
import { Observable } from 'apollo-link';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  data: string;
  constructor() {}
}

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  querySubscription;
  logingUser;
  isLoginSuccessful: boolean = false;
  isUpdateWork: boolean;
  entryTabCompelted: boolean[] = [false, false, false, false];
  UpdateItemId: number = 0;
  dataInsertHappened: boolean = false;
  GlobalTabIndex = 0;

  constructor(private apollo: Apollo) {}

  getDepartment(gql) {
    return this.apollo.watchQuery<any>({
      query: gql,
    });
  }

  getEmployees(gql) {
    console.log(gql);
    return this.apollo.watchQuery<any>({
      query: gql,
    });
  }

  queryGQL(gql) {
    //console.log(gql);
    return this.apollo.watchQuery<any>({
      query: gql,
    });
  }

  mutateGQL(gql) {
    //console.log(gql);
    return this.apollo.mutate<any>({
      mutation: gql,
    });
  }

  // getWork(gql) {
  //   //console.log(gql);
  //   return this.apollo.watchQuery<any>({
  //     query: gql,
  //   });
  // }

  // deleteWork(gql) {
  //   ///console.log(gql);
  //   return this.apollo.mutate<any>({
  //     mutation: gql,
  //   });
  // }

  // saveWork(gql) {
  //   //console.log(gql);
  //   return this.apollo.mutate<any>({
  //     mutation: gql,
  //   });
  // }

  // updateWork(gql) {
  //   //console.log(gql);
  //   return this.apollo.mutate<any>({
  //     mutation: gql,
  //   });
  // }

  // createUser(gql) {
  //   //console.log(gql);
  //   return this.apollo.mutate<any>({
  //     mutation: gql,
  //   });
  // }

  authenticateUser(gql) {
    //console.log(gql);
    return this.apollo.watchQuery<any>({
      query: gql,
    });
  }

  getWorkById(gql) {
    //console.log(gql);
    return this.apollo.watchQuery<any>({
      query: gql,
    });
  }
}
