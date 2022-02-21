import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http"; // Connection via HTTP protocol with node API
import { RouterModule, Routes } from "@angular/router"; // Routing through the website

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListOfUsersComponent } from './components/list-of-users/list-of-users.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TestDiagramComponent } from './components/test-diagram/test-diagram.component';
import { DiagramCreationComponent } from './components/diagram-creation/diagram-creation.component';
import { DiagramCreationLastComponent } from './components/diagram-creation-last/diagram-creation-last.component';
import { LoginComponent } from './components/login/login.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'main', component: MainMenuComponent},
  {path: 'users', component: ListOfUsersComponent},
  {path: 'domain_craft_area', component: DiagramCreationComponent},
  {path: 'desing_your_diagram', component: DiagramCreationLastComponent},  
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'test', component: TestDiagramComponent},
  {path: '**', component: PageNotFoundComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    ListOfUsersComponent,
    PageNotFoundComponent,
    TestDiagramComponent,
    DiagramCreationComponent,
    DiagramCreationLastComponent,
    LoginComponent,
    MainMenuComponent
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
