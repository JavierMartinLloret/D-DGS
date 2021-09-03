import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms' //ngModel

import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule //ngModel
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
