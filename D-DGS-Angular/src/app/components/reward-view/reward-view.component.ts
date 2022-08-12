import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { Reward } from 'src/app/models/reward';
import { Reward_Set } from 'src/app/models/reward_set';
import { DiagramDomainService } from 'src/app/services/diagramDomain.service';
import { UsersService } from 'src/app/services/users.service';



const LOG_TOKEN: string = "LOG_TOKEN";
// LOG_TOKEN: null | FAILED | identificador del dominio del usuario
@Component({
  selector: 'app-reward-view',
  templateUrl: './reward-view.component.html',
  styleUrls: ['./reward-view.component.css']
})
export class RewardViewComponent implements OnInit {

  // Domain_Key
  public DOMAIN_KEY: string="";

  // Containers
  public rewards: Reward[] = [];

  // Local variables
  public currentSet: Reward_Set = new Reward_Set("","",undefined);
  public newReward: Reward = new Reward("","","",0);

  // Flags
  public userIsAdmin: boolean = false;
  public thisUserOwnsTheSet: boolean = false;
  public isAddRewardClicked: boolean = false;

  // Table needs
  @ViewChild('table') table: MatTable<Reward> = {} as MatTable<Reward>;
  public tableHeader: string[] = ['DatabaseID', 'Name', 'Description', 'Priority', 'Actions'];
  dropTable(event: CdkDragDrop<Reward[]>) {
    const prevIndex = this.rewards.findIndex((d) => d === event.item.data);
    moveItemInArray(this.rewards, prevIndex, event.currentIndex);
    this.rewards.forEach((element: Reward) => {
      element.priority = this.rewards.indexOf(element);
      this._diagramDomainService.updateAReward(element).subscribe(res => {})
    })
    this.table.renderRows();
  }

  constructor(private _router: Router, private _diagramDomainService: DiagramDomainService, private _usersService: UsersService) {
    let aux = sessionStorage.getItem(LOG_TOKEN);
    if(aux)
    {
      let currentSetID = this._router.url.split('/').pop();
      this.DOMAIN_KEY = aux;

      if(currentSetID)
      {
        this._diagramDomainService.getARewardSet(currentSetID).subscribe((res:any) => {
          this.thisUserOwnsTheSet = res.domain_key == this.DOMAIN_KEY;
          this.currentSet = res;
          if(!this.thisUserOwnsTheSet)
            this._router.navigateByUrl('/main');
        })

        this._diagramDomainService.getRewardsOfACertainSet(currentSetID).subscribe((UnorderedRewards:any) => {
          let auxArray:Array<Reward> = UnorderedRewards;
          this.rewards = auxArray.sort((a, b) => {
            return a.priority > b.priority ? 1 : -1;
          })
        })

        this._usersService.isAnAdmin(this.DOMAIN_KEY).subscribe(res => {
          if(res)
            this.userIsAdmin = true;
        });
      }
    }
  }

  ngOnInit(): void {}

  unlogUser()
  {
    sessionStorage.removeItem(LOG_TOKEN)
  }

  addNewRewardClicked()
  {
    this.isAddRewardClicked = this.isAddRewardClicked ? false: true;
  }

  createNewReward()
  {
    let priority: number = 0;
    this.rewards.forEach((r: Reward) => {
      priority++;
    });

    if(this.currentSet._id)
    {
      this.newReward.parent_set = this.currentSet._id;
      this.newReward.priority = priority;
      this._diagramDomainService.postANewReward(this.newReward).subscribe(res => {window.location.reload();})
    }
  }

  deleteReward(r: Reward)
  {
    if(r._id)
    {
      this._diagramDomainService.deleteAReward(r._id.toString()).subscribe(res => {window.location.reload();})      
    }
  }

}
