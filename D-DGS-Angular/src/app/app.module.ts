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
import { DiagramCreationComponent } from './components/domain_creation/diagram-creation.component';
import { LoginComponent } from './components/login/login.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { RegisterComponent } from './components/register/register.component';
import { DiagramsComponent } from './components/diagrams/diagrams.component';
import { DiagramDomainService } from './services/diagramDomain.service';
import { UsersService } from './services/users.service';
import { RewardDomainComponent } from './components/reward-domain/reward-domain.component';
import { DomainViewComponent } from "./components/domain-view/domain-view.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* ANGULAR MATERIAL */
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { ActivityViewComponent } from './components/activity-view/activity-view.component';
import { RewardViewComponent } from './components/reward-view/reward-view.component';

import { DragDropModule} from "@angular/cdk/drag-drop";
import { DesingStrategyComponent } from './components/desing-strategy/desing-strategy.component';


const routes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'main', component: MainMenuComponent},
  {path: 'domain_craft_area', component: DiagramCreationComponent},
  {path: 'domain_craft_area/domains/:id', component: DomainViewComponent},
  {path: 'domain_craft_area/activities/:id', component: ActivityViewComponent},
  {path: 'reward_craft_area', component: RewardDomainComponent},
  {path: 'reward_craft_area/reward_set/:id', component: RewardViewComponent},
  {path: 'diagrams', component: DiagramsComponent},  
  {path: 'diagrams/:id', component: DesingStrategyComponent},
  {path: 'diagrams', component: DiagramsComponent},  
  {path: 'users', component: ListOfUsersComponent},
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
    LoginComponent,
    MainMenuComponent,
    RegisterComponent,
    DiagramsComponent,
    RewardDomainComponent,
    DomainViewComponent,
    ActivityViewComponent,
    RewardViewComponent,
    DesingStrategyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSelectModule,
    MatTableModule,
    DragDropModule
  ],
  providers: [
    DiagramDomainService,
    UsersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
