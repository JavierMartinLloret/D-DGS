import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http"; // Connection via HTTP protocol with node API
import { RouterModule, Routes } from "@angular/router"; // Routing through the website

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListOfUsersComponent } from './components/list-of-users/list-of-users.component';
import { InsertUserComponent } from './components/insert-user/insert-user.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UserComponent } from './components/user/user.component';
import { TestDiagramComponent } from './components/test-diagram/test-diagram.component';
import { DiagramCreationComponent } from './components/diagram-creation/diagram-creation.component';
import { DiagramCreationLastComponent } from './components/diagram-creation-last/diagram-creation-last.component';

const routes: Routes = [
  {path: 'users', component: ListOfUsersComponent},
  {path: 'users/:id', component: UserComponent},
  {path: 'insert_user', component: InsertUserComponent},
  {path: 'create_a_diagram', component: DiagramCreationComponent},
  {path: 'create_a_diagram/desing', component: DiagramCreationLastComponent},
  {path: '', redirectTo: '/users', pathMatch: 'full'},
  {path: 'test', component: TestDiagramComponent},
  {path: '**', component: PageNotFoundComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    ListOfUsersComponent,
    InsertUserComponent,
    PageNotFoundComponent,
    UserComponent,
    TestDiagramComponent,
    DiagramCreationComponent,
    DiagramCreationLastComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
