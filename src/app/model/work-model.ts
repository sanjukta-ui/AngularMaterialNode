import gql from 'graphql-tag';
import { GraphqlService } from 'src/app/service/graphql.service';

export namespace WorkSystem {
  export interface Work {
    _id: string;
    project: string;
    formname: string;
    status: string;
    gender: string;
    permaentaddress: string;
    temporaryaddress: string;
    communicationaddress: string;
    created: string;
    modified: string;
    tabno: number;
    userid: string;
  }

  export interface User {
    _id: string;
    fname: string;
    lname: string;
    email: string;
    mobile: string;
    password: string;
    token: string;
  }

  export enum Gender {
    Male = 'M',
    Female = 'F',
  }

  export enum Status {
    WorkInProgress = 'W',
    Completed = 'C',
    //InComplete = 'I',
  }
}

export namespace GQLQueryGenerate {
  export class UserGQL {
    public saveUser(saveVal) {
      return gql`
        mutation {
          createUser(
            userInput: {
              fname: "${saveVal.fname}"
              lname: "${saveVal.lname}"
              email: "${saveVal.email}"
              mobile: "${saveVal.mobile}"
              password: "${saveVal.password}"
            }
          ) {
            _id
            fname
            lname
            email
          }
        }
      `;
    }

    public updateUser(saveVal) {
      let gqlQuery = gql`
        mutation {
          updateUser(id:"${saveVal._id}", 
            userInput: {
              fname: "${saveVal.fname}"
              lname: "${saveVal.lname}"
              email: "${saveVal.email}"
              mobile: "${saveVal.mobile}"
              password: "${saveVal.password}"
            }
          ) {
            _id
            fname
            lname
            email
          }
        }
      `;
      console.log(gqlQuery);

      return gqlQuery;
    }
  }

  export class WorkGQL {
    public saveWork(saveVal, token) {
      let query = gql`
        mutation {
          createWork(
            workInput: {
              project: "${saveVal.project}"
              formname: "${saveVal.formname}"
              status: "${saveVal.status}"
              permaentaddress: "${saveVal.permaentaddress.replace(/\s+/g, ' ')}"
              temporaryaddress: "${saveVal.temporaryaddress.replace(
                /\s+/g,
                ' '
              )}"
              communicationaddress: "${saveVal.communicationaddress.replace(
                /\s+/g,
                ' '
              )}"
              gender: "${saveVal.gender}"
              tabno: ${saveVal.tabno}
              userid: "${saveVal.userid}"
            },
            token:"${token}"
          ) {
            project
            formname
            status
            gender
            permaentaddress
            temporaryaddress
            communicationaddress
          }
        }
      `;
      //console.log('gql ', query);
      return query;
    }

    public updateWork(id, saveVal, token) {
      let query = gql`
      mutation {
        updateWork(
          workid: "${id}"
          workInput: {
            project: "${saveVal.project}"
            formname: "${saveVal.formname}"
            status: "${saveVal.status}"
            permaentaddress: "${saveVal.permaentaddress.replace(/\s+/g, ' ')}"
            temporaryaddress: "${saveVal.temporaryaddress.replace(/\s+/g, ' ')}"
            communicationaddress: "${saveVal.communicationaddress.replace(
              /\s+/g,
              ' '
            )}"
            gender: "${saveVal.gender}"
            tabno: ${saveVal.tabno}
            userid: "${saveVal.userid}"
          },
          token:"${token}"
        ) {
          _id
          formname
          tabno
        }
      }
    `;
      //console.log(query);
      return query;
    }

    public getWorkDetailsById(id, token) {
      return gql`
      query {
        getWorkById(id: "${id}",token:"${token}") {
          _id
          project
          formname
          status
          gender
          permaentaddress
          temporaryaddress
          communicationaddress
          tabno
          userid
        }
      }
    `;
    }

    public deleteWork(data, token) {
      return gql`                
            mutation
            {
              deleteWork(workid:"${data}",token:"${token}")
              {
                formname
                tabno
              }
            }
    `;
    }
  }
}
