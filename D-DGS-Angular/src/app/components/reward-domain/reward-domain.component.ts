import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Reward } from 'src/app/models/reward';
import { Reward_Set } from 'src/app/models/reward_set';
import { DiagramDomainService } from 'src/app/services/diagramDomain.service';
import { UsersService } from 'src/app/services/users.service';

const LOG_TOKEN: string = "LOG_TOKEN";
const DEFAULT_SET_NAME: string = "Default Reward Set";
// LOG_TOKEN: null | FAILED | identificador del dominio del usuario

@Component({
  selector: 'app-reward-domain',
  templateUrl: './reward-domain.component.html',
  styleUrls: ['./reward-domain.component.css']
})
export class RewardDomainComponent implements OnInit {

  // Domain_Key
  public DOMAIN_KEY: string="";

  // Containers
  userSets: any = [];
  setRewards: any = [];
  
  // Local variables
  public newSetName: String = "";
  public currentMaxPriority: number = 0;
  public newRewardName: String = "";
  public newRewardDescription: String = "";
  public newRewardPriority: Number = 0;

  // Objects
  public setSelected: Reward_Set = new Reward_Set("","");

  // Flags
  public isSetIsSelected: Boolean = false;
  public isSetSelectedDefault: Boolean = false;
  public isCreateANewSetSelected: Boolean = false;
  public isNewRewardSelected: Boolean = false;
  public userIsAdmin: boolean = false;

  constructor(private _router: Router, private _diagramDomainService: DiagramDomainService, private _usersService: UsersService) {
    let aux = sessionStorage.getItem(LOG_TOKEN);
    if(aux)
    {
      this.DOMAIN_KEY = aux;
      this._diagramDomainService.getAllRewardSetsFromACertainUser(this.DOMAIN_KEY).subscribe(res => {this.userSets = res;});
    }
  }

  ngOnInit(): void {
    let aux = sessionStorage.getItem(LOG_TOKEN);
    this._usersService.isAnAdmin(this.DOMAIN_KEY).subscribe(res => {
      if(res)
        this.userIsAdmin = true;
    })
    if(aux == null || aux == "FAILED")
    {
      sessionStorage.removeItem(LOG_TOKEN);  
      this._router.navigateByUrl('/login');
    }
  }

  unlogUser()
  {
    sessionStorage.removeItem(LOG_TOKEN)
  }

  setIsSelected()
  {
    if(this.setSelected._id != undefined)
    {
      this._diagramDomainService.getRewardsOfACertainSet(this.setSelected._id.toString()).subscribe(r => {
        this.setRewards = r;
        this.isSetIsSelected = true;

        if(this.setSelected.name == DEFAULT_SET_NAME)
          this.isSetSelectedDefault = true;
        else
          this.isSetSelectedDefault = false;

        /* */
        let aux: number = 0;
        this.setRewards.forEach((reward: Reward) => {
          if(reward.priority > aux)
            aux = reward.priority.valueOf();
        });
        this.currentMaxPriority = ++aux;
        /* */
      })
    }
  }

  createANewSetIsSelected()
  {
    this.isCreateANewSetSelected = this.isCreateANewSetSelected ? false : true;
  }

  addNewRewardIsClicked()
  {
    this.isNewRewardSelected = (this.isNewRewardSelected) ? false : true;
  }

  createANewSet()
  {
    let newSet = new Reward_Set(this.newSetName, this.DOMAIN_KEY);
    this._diagramDomainService.postANewRewardSet(newSet).subscribe(res => {window.location.reload();})
  }

  deleteSelectedSet()
  {
    if(this.setSelected._id != undefined)
    {
      this._diagramDomainService.deleteAllRewardsFromACertainSet(this.setSelected._id.toString()).subscribe(res => {
        if(this.setSelected._id != undefined)
        this._diagramDomainService.deleteARewardSet(this.setSelected._id.toString()).subscribe(res => {window.location.reload();})
      })
    }
  }

  addNewReward()
  {
    if(this.setSelected._id != undefined)
    {
      let newReward = new Reward(this.setSelected._id, this.newRewardName, this.newRewardDescription, this.newRewardPriority);
      this._diagramDomainService.postANewReward(newReward).subscribe(res => {window.location.reload();})
    }

  }

  deleteAReward(reward: Reward)
  {
    if(reward._id != undefined)
    {
      this._diagramDomainService.deleteAReward(reward._id.toString()).subscribe(res => {window.location.reload();});
    }    
  }

  debugmethod()
  {
    console.log(this.userIsAdmin);
  }

}
