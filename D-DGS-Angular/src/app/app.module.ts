import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms' //ngModel

import { HttpClientModule } from "@angular/common/http";

import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ListOfUsersComponent } from './components/list-of-users/list-of-users.component';

@NgModule({
  declarations: [
    AppComponent,
    ListOfUsersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, //ngModel
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
