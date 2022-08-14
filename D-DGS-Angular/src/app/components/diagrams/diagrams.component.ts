import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Context } from 'src/app/models/context';
import { Diagram } from 'src/app/models/diagram';
import { Reward_Set } from 'src/app/models/reward_set';
import { Strategy } from 'src/app/models/strategy';
import { SubStrategy } from 'src/app/models/substrategy';
import { DiagramDomainService } from 'src/app/services/diagramDomain.service';
import { FileRelatedService } from 'src/app/services/file-related.service';
import { StrategiesService } from 'src/app/services/strategies.service';
import { UsersService } from 'src/app/services/users.service';

const LOG_TOKEN: string = "LOG_TOKEN";
const PASSING_DIAGRAM: string = "PASSING_DIAGRAM_KEY";
// LOG_TOKEN: null | FAILED | identificador del dominio del usuario
// * DEBE SUSTITUIRSE EN ALGÚN MOMENTO POR ALGO CIFRADO

@Component({
  selector: 'app-diagrams',
  templateUrl: './diagrams.component.html',
  styleUrls: ['./diagrams.component.css']
})
export class DiagramsComponent implements OnInit {

  
  // Domain_Key
  public DOMAIN_KEY: string="";

  // Containers
  public strategies: Strategy[] = [];
  public domains: Context[] = [];
  public reward_sets: Reward_Set[] = [];

  // Local variables
  public newStrategy: Strategy = new Strategy("","","",new Context("","",undefined), new Reward_Set("","",undefined), /*Substrategies[]*/[]);

  // Table needs
  public tableHeader: string[] = ['DatabaseID', 'Name', 'Description', 'Domain', 'Reward_Set', 'Actions'];

  // Flags
  public userHasDiagrams: boolean = false;
  public userIsAdmin: boolean = false;
  public isCreateANewStrategyClicked: boolean = false;
  

  constructor(private _router: Router, private _diagramDomainService: DiagramDomainService, private _usersService: UsersService,
    private _strategiesService: StrategiesService, private _downloadService: FileRelatedService) {
    let aux = sessionStorage.getItem(LOG_TOKEN);
    if(aux)
    {
      this.DOMAIN_KEY = aux;

      this._diagramDomainService.getContextsFromAUser(this.DOMAIN_KEY).subscribe((res: any) => this.domains = res)
      this._diagramDomainService.getAllRewardSetsFromACertainUser(this.DOMAIN_KEY).subscribe((res: any) => this.reward_sets = res);
      this._strategiesService.getAllStrategiesFromAnSpecificUser(this.DOMAIN_KEY).subscribe((res: any) => {
        this.strategies = res;
        this.userHasDiagrams = this.strategies.length > 0;
      });

      this._usersService.isAnAdmin(this.DOMAIN_KEY).subscribe(res => {
        if(res)
          this.userIsAdmin = true;
      })
    }
    
  }

  ngOnInit(): void {}

  unlogUser(): void {sessionStorage.removeItem(LOG_TOKEN);}

  debug():void {console.log(this.newStrategy);}

  createANewStrategyIsClicked(): void {this.isCreateANewStrategyClicked = this.isCreateANewStrategyClicked ? false : true;}

  createANewStrategy(): void
  {
    this.newStrategy.domain_key = this.DOMAIN_KEY;
    this._strategiesService.postANewStrategy(this.newStrategy).subscribe(res => window.location.reload());
  }

}
