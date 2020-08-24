import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WorkDetailsComponent } from './user-info/work-details/work-details.component';
import { WorkListComponent } from './user-info/work-list/work-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkEntryComponent } from './user-info/work-entry/work-entry.component';
import { HttpClientModule } from '@angular/common/http';
import { IgxSnackbarModule } from 'igniteui-angular';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';

import { MatPaginatorModule } from '@angular/material/paginator';
// For MDB Angular Free
import { ChartsModule, WavesModule } from 'angular-bootstrap-md';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ErrorComponent } from './error/error/error.component';
import { GraphQLModule } from './graphql.module';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { SignupComponent } from './login/signup/signup.component';
import { MatDialogModule } from '@angular/material/dialog';
import {
  Injectable,
  ComponentFactoryResolver,
  ViewContainerRef,
} from '@angular/core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ComponentLoader {
  loadChildren: () => Promise<any>;
}
//import { MatFileUploadModule } from 'angular-material-fileupload';

@NgModule({
  declarations: [
    AppComponent,
    WorkDetailsComponent,
    WorkListComponent,
    WorkEntryComponent,
    ErrorComponent,
    LoginFormComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatCheckboxModule,
    ChartsModule,
    WavesModule,
    MatRadioModule,
    MatDividerModule,
    FlexLayoutModule,
    MatCardModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    GraphQLModule,
    MatDialogModule,
    MatBadgeModule,
    //MatFileUploadModule,
    //RouterModule.forRoot()//APP_ROUTES, { onSameUrlNavigation: 'reload' }),
  ],
  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
