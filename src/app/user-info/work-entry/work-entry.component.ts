import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
} from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkSystem, GQLQueryGenerate } from '../../model/work-model';
import gql from 'graphql-tag';
import { GraphqlService } from 'src/app/service/graphql.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

export interface DialogData {
  email: string;
  name: string;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-work-entry',
  templateUrl: './work-entry.component.html',
  styleUrls: ['./work-entry.component.css'],
})
export class WorkEntryComponent
  implements OnInit, AfterViewInit, DoCheck, AfterContentChecked {
  success: boolean = false;
  successId: number;
  deptList;
  imageUrl;
  showDefaultImage = true;
  genderList = WorkSystem.Gender;
  statusList = WorkSystem.Status;
  updateWorkId;
  id: number;
  disableButton = false;
  ErrorMsg: any;
  isViewOnly = false;

  email: string;
  name: string;

  @Input() actionButton = 'Save As Draft';
  @Input() TabIndex;

  matcher = new MyErrorStateMatcher();

  empForm = new FormGroup({
    project: new FormControl('', [Validators.required]),
    formname: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    permaentaddress: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(255),
    ]),
    temporaryaddress: new FormControl(''),
    communicationaddress: new FormControl(''),
    gender: new FormControl(''),
  });

  constructor(
    public snackBar: MatSnackBar,
    private gqlServ: GraphqlService,
    private route: ActivatedRoute,
    //private router: Router,
    public dialog: MatDialog
  ) {}

  onSubmit() {}

  ngOnInit(): void {
    //this.TabIndex = this.gqlServ.GlobalTabIndex;
    //console.log(' ngOnInit - tab index ', this.TabIndex);
    this.actionButton = 'Save';
    this.clearFileds();

    if (this.route.snapshot.paramMap.get('id')) {
      this.updateWorkId = this.route.snapshot.paramMap.get('id');
      this.actionButton = 'Update As Draft';
      const userWorkDetails = new GQLQueryGenerate.WorkGQL().getWorkDetailsById(
        this.updateWorkId,
        this.gqlServ.logingUser.token
      );

      this.gqlServ
        .queryGQL(userWorkDetails)
        .valueChanges.subscribe(({ data, loading }) => {
          let tmpdataSource = <WorkSystem.Work>data.getWorkById;

          this.empForm.setValue({
            project: data.getWorkById.project,
            formname: data.getWorkById.formname,
            status: data.getWorkById.status,
            gender: data.getWorkById.gender,
            permaentaddress: data.getWorkById.permaentaddress,
            temporaryaddress: data.getWorkById.temporaryaddress,
            communicationaddress: tmpdataSource.communicationaddress,
          });
        });

      if (this.route.snapshot.paramMap.get('action') === 'view') {
        this.disableButton = true;
        this.empForm.disable();
      }
    }
  }

  ngDoCheck(): void {}

  ngAfterContentChecked(): void {
    if (this.TabIndex == '3') {
      this.actionButton = 'Final Submission';
    }
  }

  ngAfterViewInit() {
    this.TabIndex = this.gqlServ.GlobalTabIndex;
    console.log(' ngAfterViewInit - tab index ', this.TabIndex);
    if (this.gqlServ.isUpdateWork == true) {
      this.actionButton = 'Update As Draft';
      this.gqlServ.dataInsertHappened = true;
    }
  }

  clearFileds() {
    this.empForm.reset();
    this.actionButton = 'Save As Draft';
    this.id = undefined;
  }

  submitData() {
    if (!this.empForm.invalid && this.gqlServ.logingUser != undefined) {
      let saveVal = <WorkSystem.Work>this.empForm.value;
      saveVal.userid = this.gqlServ.logingUser._id;
      saveVal.tabno = this.TabIndex;
      let gqlText = new GQLQueryGenerate.WorkGQL();

      this.gqlServ.dataInsertHappened = true;

      if (
        this.actionButton === 'Save As Draft' ||
        this.actionButton === 'Final Submission'
      ) {
        let tmpEmp = this.empForm.value;
        let saveGql = gqlText.saveWork(saveVal, this.gqlServ.logingUser.token);
        this.gqlServ.mutateGQL(saveGql).subscribe((res) => {
          this.snackBar.open('Data inserted successfully!', '', {
            duration: 2000,
            panelClass: 'notif-success',
          });
          if (!this.route.snapshot.paramMap.get('id')) {
            this.disableButton = true;
          }
        });

        this.gqlServ.entryTabCompelted[parseInt(this.TabIndex)] = true;
        this.actionButton = 'Update As Draft';

        console.log(this.TabIndex);
        console.log(this.gqlServ.entryTabCompelted[0]);
        console.log(this.gqlServ.entryTabCompelted[1]);
        console.log(this.gqlServ.entryTabCompelted[2]);
        console.log(this.gqlServ.entryTabCompelted[3]);

        if (
          this.TabIndex == '3' &&
          this.gqlServ.entryTabCompelted[0] &&
          this.gqlServ.entryTabCompelted[1] &&
          this.gqlServ.entryTabCompelted[2]
        ) {
          const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
            width: '250px',
            data: { name: this.name, email: this.email },
          });

          dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
          });

          this.gqlServ.entryTabCompelted[0] = false;
          this.gqlServ.entryTabCompelted[1] = false;
          this.gqlServ.entryTabCompelted[2] = false;
          this.gqlServ.entryTabCompelted[3] = false;
        }
      } else {
        let tmpEmp = this.empForm.value;
        this.gqlServ.dataInsertHappened = true;
        let updateGql = gqlText.updateWork(
          this.updateWorkId,
          saveVal,
          this.gqlServ.logingUser.token
        );

        this.gqlServ.mutateGQL(updateGql).subscribe((res) => {
          this.snackBar.open('Record updated successfully!', '', {
            duration: 2000,
            panelClass: 'notif-success',
          });
        });
      }
    } else {
      this.snackBar.open('Please enter values correctly in all fields.', '', {
        duration: 4000,
        panelClass: 'notif-fail',
      });
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: { name: this.name, email: this.email },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./work-entry.component.css'],
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onOkClick(): void {
    this.router.navigate(['/home']);
    this.dialogRef.close();
  }
}
