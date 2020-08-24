import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormGroup,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkSystem, GQLQueryGenerate } from '../../model/work-model';
import { GraphqlService } from 'src/app/service/graphql.service';
import { Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { validate } from 'graphql';
import gql from 'graphql-tag';

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

export interface DialogData {
  email: string;
  name: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm = new FormGroup({
    fname: new FormControl('', [Validators.required]),
    lname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    mobile: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
      Validators.minLength(10),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    password2: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });
  loginInvalid;
  formText;
  disableDuringEdit = false;
  updateUser: WorkSystem.User;

  constructor(
    public dialogRef: MatDialogRef<SignupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public snackBar: MatSnackBar,
    private gqlServ: GraphqlService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formText = this.data.name;
    console.log(this.data.name);
    if (this.data.name == 'Reset Password') this.loadUser();
  }

  onSubmit() {
    console.log(this.signupForm.invalid);
    console.log(this.data.name);

    if (
      this.signupForm.get('password').value !=
      this.signupForm.get('password2').value
    ) {
      this.snackBar.open(
        'Both the passowrds should be same. Please try again!',
        'Failed!',
        {
          duration: 4000,
          panelClass: 'notif-fail',
        }
      );
    } else if (
      !this.signupForm.invalid &&
      this.data.name == 'Register Yourself'
    ) {
      let saveVal = <WorkSystem.User>this.signupForm.value;
      console.log('saveVal');

      try {
        let saveGql = new GQLQueryGenerate.UserGQL().saveUser(saveVal);

        this.gqlServ.mutateGQL(saveGql).subscribe(
          (res) => {
            this.snackBar.open('User created successfully!', '', {
              duration: 4000,
              panelClass: 'notif-success',
            });
            this.dialogRef.close();
          },
          (error) => {
            console.log('there was an error sending the query', error);
            this.snackBar.open('Mail Id already exists.', 'Failed!', {
              duration: 4000,
              panelClass: 'notif-fail',
            });
          }
        );
      } catch (err) {
        console.log(err);
      }
    } else if (!this.signupForm.invalid && this.data.name == 'Reset Password') {
      let updateVal = <WorkSystem.User>this.signupForm.value;

      try {
        this.updateUser.password = this.signupForm.get('password').value;
        let saveGql = new GQLQueryGenerate.UserGQL().updateUser(
          this.updateUser
        );

        this.gqlServ.mutateGQL(saveGql).subscribe(
          (res) => {
            this.snackBar.open('User updated successfully!', '', {
              duration: 4000,
              panelClass: 'notif-success',
            });
            this.dialogRef.close();
          },
          (error) => {
            console.log('there was an error sending the query', error);
            this.snackBar.open('something went wrong.', 'Failed!', {
              duration: 4000,
              panelClass: 'notif-fail',
            });
          }
        );
      } catch (err) {
        console.log(err);
      }
    } else {
      this.snackBar.open('Please enter values correctly in all fields.', '', {
        duration: 4000,
        panelClass: 'notif-fail',
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  restForm() {
    this.signupForm.reset({});
  }
  cancelForm() {
    this.dialogRef.close();
  }

  loadUser() {
    let saveGql = gql`
        query
          {
            getUserByEmail(email:"${this.data.email}")
            {
              _id
              fname
              lname
              email
              mobile
              
            }
          }
      `;

    console.log(this.data, saveGql);
    try {
      this.gqlServ.queryGQL(saveGql).valueChanges.subscribe((res) => {
        this.updateUser = <WorkSystem.User>res.data.getUserByEmail;

        console.log(this.updateUser);

        this.signupForm.setValue({
          fname: this.updateUser.fname,
          lname: this.updateUser.lname,
          email: this.updateUser.email,
          mobile: this.updateUser.mobile,
          password: 'xxxxx',
          password2: 'xxxxx',
        });
        //this.disableDuringEdit = true;
        this.signupForm.get('fname').disable();
        this.signupForm.get('lname').disable();
        this.signupForm.get('email').disable();
        this.signupForm.get('mobile').disable();
        this.disableDuringEdit = true;
      });
    } catch (err) {
      console.log('sfsf');
    }
  }
}
