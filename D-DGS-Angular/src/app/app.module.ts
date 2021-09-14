import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms' //ngModel

import { HttpClientModule } from "@angular/common/http"; // Connection via HTTP protocol with node API

import { RouterModule, Routes } from "@angular/router"; // Routing through the website

import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ListOfUsersComponent } from './components/list-of-users/list-of-users.component';
import { InsertUserComponent } from './components/insert-user/insert-user.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DiagramExampleComponent } from './components/diagram-example/diagram-example.component';

const routes: Routes = [
  {path: 'users', component: ListOfUsersComponent},
  {path: 'insert_user', component: InsertUserComponent},
  {path: '', redirectTo: '/users', pathMatch: 'full'},
  {path: 'diagram-example', component: DiagramExampleComponent},
  {path: '**', component: PageNotFoundComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    ListOfUsersComponent,
    InsertUserComponent,
    PageNotFoundComponent,
    DiagramExampleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, //ngModel
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
