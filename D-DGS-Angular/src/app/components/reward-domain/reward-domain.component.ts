import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Reward } from 'src/app/models/reward';
import { Reward_Set } from 'src/app/models/reward_set';
import { DiagramDomainService } from 'src/app/services/diagramDomain.service';

const LOG_TOKEN: string = "LOG_TOKEN";
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
  public currentMaxPriority: number = 0;
  public newRewardName: String = "";
  public newRewardDescription: String = "";
  public newRewardPriority: Number = 0;

  // Objects
  public setSelected: Reward_Set = new Reward_Set("","");

  // Flags
  public isSetIsSelected: Boolean = false;
  public isNewRewardSelected: Boolean = false;

  constructor(private _router: Router, private _diagramDomainService: DiagramDomainService) {
    let aux = sessionStorage.getItem(LOG_TOKEN);
    if(aux)
    {
      this.DOMAIN_KEY = aux;
      this._diagramDomainService.getAllRewardSetsFromACertainUser(this.DOMAIN_KEY).subscribe(res => {this.userSets = res;});
      
    }
  }

  ngOnInit(): void {
    let aux = sessionStorage.getItem(LOG_TOKEN);
    if(aux == null || aux == "FAILED")
    {
      sessionStorage.removeItem(LOG_TOKEN);  
      this._router.navigateByUrl('/login');
    }
  }

  setIsSelected()
  {
    if(this.setSelected._id != undefined)
    {
      this._diagramDomainService.getRewardsOfACertainSet(this.setSelected._id.toString()).subscribe(r => {
        this.setRewards = r;
        this.isSetIsSelected = true;

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

  addNewRewardIsClicked()
  {
    this.isNewRewardSelected = (this.isNewRewardSelected) ? false : true;
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
    console.log(this.currentMaxPriority);
  }

}
