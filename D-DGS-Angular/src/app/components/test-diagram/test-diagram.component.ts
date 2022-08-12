import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, ViewChild, OnInit  } from '@angular/core';
import { DiagramDomainService } from 'src/app/services/diagramDomain.service';
import { UsersService } from 'src/app/services/users.service';
import {MatTable} from '@angular/material/table';
import { Reward } from 'src/app/models/reward';

export interface IHeaders {
  id: string | number;
  name: string;
  age: number | string;
  gender: string;
  country: string;
  priority: number;
}

const LOG_TOKEN: string = "LOG_TOKEN";
const RewardSetID: string = "62f38f7838c96401dd15c50a";

@Component({
  selector: 'app-test-diagram',
  templateUrl: './test-diagram.component.html',
  styleUrls: ['./test-diagram.component.css']
})
export class TestDiagramComponent implements OnInit {

  @ViewChild('table') table: MatTable<IHeaders> = {} as MatTable<IHeaders>;

  displayedColumns: string[] = ['id', 'name', 'description', 'priority', 'actions'];
  public rewards: Reward[] = [];

  public DOMAIN_KEY: string ="";
  public userIsAdmin: boolean = true;
  

  

  constructor(private _diagramDomainService: DiagramDomainService, private _usersService: UsersService) {
    let aux = sessionStorage.getItem(LOG_TOKEN);
    if(aux)
    {
      this.DOMAIN_KEY = aux;

      this._diagramDomainService.getRewardsOfACertainSet(RewardSetID).subscribe((a:any) => {this.rewards = a;})
      this._usersService.isAnAdmin(this.DOMAIN_KEY).subscribe(res => {
        if(res)
          this.userIsAdmin = true;
      })
    }
  }

  ngOnInit(): void {
    
  }

  unlogUser()
  {
    sessionStorage.removeItem(LOG_TOKEN)
  }

  debug()
  {
    this.userIsAdmin = this.userIsAdmin ? false: true;
  }

  dropTable(event: CdkDragDrop<Reward[]>) {
    const prevIndex = this.rewards.findIndex((d) => d === event.item.data);
    moveItemInArray(this.rewards, prevIndex, event.currentIndex);
    this.rewards.forEach((element: Reward) => {
      element.priority = this.rewards.indexOf(element);
    })
    this.table.renderRows();
  }
}
