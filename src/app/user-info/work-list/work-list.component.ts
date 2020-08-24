import {
  Component,
  OnInit,
  ViewChild,
  Input,
  EventEmitter,
  Output,
  DoCheck,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import gql from 'graphql-tag';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GraphqlService } from 'src/app/service/graphql.service';
import { WorkSystem, GQLQueryGenerate } from 'src/app/model/work-model';
import { Router } from '@angular/router';

const userWorkDetails = gql`
  query {
    works {
      _id
      project
      formname
      status
      modified
      userid
    }
  }
`;

@Component({
  selector: 'app-emp-list',
  templateUrl: './work-list.component.html',
  styleUrls: ['./work-list.component.css'],
})
export class WorkListComponent implements OnInit, DoCheck {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Output() valueChange = new EventEmitter();
  Counter = 0;
  spinner = true;

  color = 'accent';
  dataSource;
  deptList;
  displayedColumns: string[] = [
    'id',
    'ProjectName',
    'FormName',
    'Status',
    'ModifiedDate',
    'Action',
    'Action2',
  ];
  ErrorMsg: any;

  constructor(
    public snackBar: MatSnackBar,
    private gqlServ: GraphqlService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //this.gqlServ.dataInsertHappened = false;
    this.LoadDataSetGql();
  }

  ngDoCheck() {
    if (this.gqlServ.dataInsertHappened) {
      this.gqlServ.dataInsertHappened = false;
      this.LoadDataSetGql();
    }
  }

  valueChanged(data) {
    this.valueChange.emit(data);
  }

  EditRec(data) {
    this.gqlServ.GlobalTabIndex = 0;
    this.router.navigate(['/details/work/edit/' + data]);
    this.gqlServ.UpdateItemId = data;
    this.valueChanged(data);
  }
  ViewRec(data) {
    this.gqlServ.GlobalTabIndex = 0;
    this.router.navigate(['/details/work/view/' + data]);
    this.gqlServ.UpdateItemId = data;
    this.valueChanged(data);
  }
  goToWork() {
    this.router.navigate(['/details/work']);
  }

  DeleteRec(data) {
    let delGql = new GQLQueryGenerate.WorkGQL().deleteWork(
      data,
      this.gqlServ.logingUser.token
    );

    this.gqlServ.mutateGQL(delGql).subscribe((res) => {
      this.snackBar.open('Record deleted.', 'Success!', {
        duration: 2000,
      });

      this.LoadDataSetGql(data);
    });
  }

  LoadDataSetGql(deltedItem = '') {
    this.gqlServ
      .queryGQL(userWorkDetails)
      .valueChanges.subscribe(({ data, loading }) => {
        let tmpdataSource = <Array<WorkSystem.Work>>data.works;

        if (deltedItem != '') {
          tmpdataSource.forEach((item, index) => {
            if (item._id == deltedItem) tmpdataSource.splice(index, 1);
          });
        }

        this.dataSource = new MatTableDataSource<WorkSystem.Work>(
          tmpdataSource.filter((x) => x.userid === this.gqlServ.logingUser._id)
        );
        setTimeout(() => (this.dataSource.paginator = this.paginator));
        this.spinner = false;
      });
  }
}
