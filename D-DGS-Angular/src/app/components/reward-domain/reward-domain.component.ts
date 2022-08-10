import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  public newSet: Reward_Set = new Reward_Set("", "", undefined);
  public setToEdit: Reward_Set = new Reward_Set("","", undefined);

  // Objects
  public setSelected: Reward_Set = new Reward_Set("","");

  // Flags
  public userIsAdmin: boolean = false;
  public isAddNewSetClicked: boolean = false;
  public isEditSetClicked: boolean = false;

  // Table needs
  public tableHeader: string[] = ['DatabaseID', 'Name', 'Actions'];

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

  createNewSetClicked()
  {
    this.isAddNewSetClicked = this.isAddNewSetClicked ? false : true;
  }

  createNewSet()
  {
    this.newSet.domain_key = this.DOMAIN_KEY;
    this._diagramDomainService.postANewRewardSet(this.newSet).subscribe(res => {window.location.reload();})
  }

  navigateToRewardSet(s: Reward_Set)
  {
    if(s._id)
      this._router.navigateByUrl('reward_craft_area/reward_set/'+s._id.toString());
  }

  editSetClicked(s: Reward_Set)
  {
    this.setToEdit = s;
    this.isEditSetClicked = this.isEditSetClicked ? false: true;
  }

  editSet()
  {
    this._diagramDomainService.updateRewardSet(this.setToEdit).subscribe(res => {window.location.reload();})
  }

  deleteSet(s: Reward_Set)
  {
    if(confirm("Are you sure you want to delete this Set? This is irreversible"))
      if(s._id)
        this._diagramDomainService.deleteARewardSet(s._id.toString()).subscribe(res => {window.location.reload();})
  }

  debug()
  {
    console.log(this.userSets);
  }

}
