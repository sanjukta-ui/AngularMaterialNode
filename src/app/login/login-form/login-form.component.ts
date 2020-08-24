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
import { WorkSystem } from '../../model/work-model';
import gql from 'graphql-tag';
import { GraphqlService } from 'src/app/service/graphql.service';
import { MatDialog } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { Router } from '@angular/router';

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
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  loginInvalid;
  email: string;
  name: string;
  updateUser;

  constructor(
    public dialog: MatDialog,
    private gqlServ: GraphqlService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  openDialog(): void {
    const dialogRef = this.dialog.open(SignupComponent, {
      width: '650px',
      data: { name: 'Register Yourself', email: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.email = result;
    });
  }

  CheckIfEmailExist(email) {
    let saveGql = gql`
        query
          {
            getUserByEmail(email:"${email}")
            {
              _id
              fname
              lname
              email
              mobile
              
            }
          }
      `;
    console.log(saveGql);
    try {
      this.gqlServ.queryGQL(saveGql).valueChanges.subscribe(
        (res) => {
          this.updateUser = <WorkSystem.User>res.data.getUserByEmail;
          //console.log(this.updateUser.email);
          if (this.updateUser.email != '') {
            const dialogRef = this.dialog.open(SignupComponent, {
              width: '650px',
              data: {
                name: 'Reset Password',
                email: this.loginForm.get('email').value,
              },
            });

            dialogRef.afterClosed().subscribe((result) => {
              console.log('The dialog was closed');
              this.email = result;
            });
          } else {
            this.snackBar.open(
              'Please existing and valid email to reset.',
              'Failed!',
              {
                duration: 4000,
                panelClass: 'notif-fail',
              }
            );
          }
        },
        (error) => {
          this.snackBar.open(
            'Please existing and valid email to reset.',
            'Failed!',
            {
              duration: 4000,
              panelClass: 'notif-fail',
            }
          );
        }
      );
    } catch (err) {
      console.log('sfsf');
    }
    return false;
  }

  resetPassword(): void {
    //console.log(this.CheckIfEmailExist(this.loginForm.get('email').value));
    if (!this.loginForm.get('email').invalid) {
      this.CheckIfEmailExist(this.loginForm.get('email').value);
    }
  }

  onSubmit() {
    if (!this.loginForm.invalid) {
      let user = this.loginForm.get('email').value;
      let pwd = this.loginForm.get('password').value;
      let saveGql = gql`
        query {
          authenticateUser(email: "${user}", password: "${pwd}") {
            _id
            fname
            lname
            email
            mobile
            password
            token
          }
        }
      `;

      console.log(saveGql);
      try {
        this.gqlServ.authenticateUser(saveGql).valueChanges.subscribe((res) => {
          this.gqlServ.logingUser = <WorkSystem.User>res.data.authenticateUser;

          if (this.gqlServ.logingUser != null) {
            this.snackBar.open('User successfully authenticated!', '', {
              duration: 2000,
              panelClass: 'notif-success',
            });
            this.gqlServ.isLoginSuccessful = true;
            this.router.navigate(['/home']);
          } else {
            this.snackBar.open(res.errors[0].message, 'Failed!', {
              duration: 4000,
              panelClass: 'notif-fail',
            });
          }
        });
      } catch (err) {
        console.log('sfsf');
      }
    } else {
      this.snackBar.open('Please enter values correctly in all fields.', '', {
        duration: 4000,
        panelClass: 'notif-fail',
      });
    }
  }
}
