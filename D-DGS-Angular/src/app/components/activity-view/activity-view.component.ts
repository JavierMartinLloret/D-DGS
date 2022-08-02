import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from 'src/app/models/activity';
import { Activity_Property } from 'src/app/models/activity_property';
import { Context } from 'src/app/models/context';
import { DiagramDomainService } from 'src/app/services/diagramDomain.service';

const LOG_TOKEN: string = "LOG_TOKEN";
// LOG_TOKEN: null | FAILED | identificador del dominio del usuario

export enum propertyTypeEnum {
  STRING,
  NUMBER,
  DATE,
  UNDEFINED
} 

@Component({
  selector: 'app-activity-view',
  templateUrl: './activity-view.component.html',
  styleUrls: ['./activity-view.component.css']
})
export class ActivityViewComponent implements OnInit {

  // Domain_Key
  public DOMAIN_KEY: string="";

  // Containers
  public properties: Activity_Property[] = [];

  // Local variables
  public currentActivity: Activity = new Activity("","","");
  public newProperty: Activity_Property = new Activity_Property("","","");
  public newPropertyType: propertyTypeEnum = propertyTypeEnum.UNDEFINED;
  public newPropertyValue: any = ""; // string | number | Date

  // Table needs
  public tableHeader: string[] = ['DatabaseID', 'Name', 'Default Value', 'Actions'];

  // Flags
  public userIsAdmin: boolean = false;
  public isAddANewPropertyClicked: boolean = false;
  public isEditPropertyClicked: boolean = false;

  constructor(private _router: Router, private _diagramDomainService: DiagramDomainService) {
    let aux = sessionStorage.getItem(LOG_TOKEN);
    if(aux)
    {
      this.DOMAIN_KEY = aux;
      let currentActivityID = this._router.url.split('/').pop();
      let thisActivityBelongsToTheUser: boolean = false;
      if(currentActivityID)
      {
        this._diagramDomainService.getActivityFromId(currentActivityID).subscribe((a:any) => {
          this.currentActivity= a;

          this._diagramDomainService.getContextsFromAUser(this.DOMAIN_KEY).subscribe((contexts: any) => {
            contexts.forEach((c: Context) => {
              if(this.currentActivity.context_ID == c._id)
                thisActivityBelongsToTheUser = true;
            });
            if(thisActivityBelongsToTheUser && currentActivityID)
            {
              this._diagramDomainService.getPropertiesFromAnActivity(currentActivityID).subscribe((p:any) => {
                this.properties = p;
              })
            }
            else {this._router.navigateByUrl('/main');}
          })
        })
      }      
    }
    else {this._router.navigateByUrl('/main');}

  }

  ngOnInit(): void {

  }

  unlogUser()
  {
    sessionStorage.removeItem(LOG_TOKEN)
  }

  createANewPropertyClicked(): void {
    this.isAddANewPropertyClicked = this.isAddANewPropertyClicked ? false : true;
  }

  createNewProperty(): void {    
    if(this.currentActivity._id)
    {
      this.newProperty.activity_ID = this.currentActivity._id;
      switch (this.newPropertyType) {
        case 0:
        {
          this._diagramDomainService.postANewProperty_Stringy(this.newProperty, this.newPropertyValue).subscribe(res => {window.location.reload();})
        }break;
        case 1:
        {
          this._diagramDomainService.postANewProperty_Numerical(this.newProperty, this.newPropertyValue).subscribe(res => {window.location.reload();})
        }break;
        case 2:
        {
          this._diagramDomainService.postANewProperty_Date(this.newProperty, this.newPropertyValue).subscribe(res => {window.location.reload();})
        }break;
        default:
          console.log("Error when creating the property");
        break;
      }
    }   
  }

  deleteProperty(p: Activity_Property): void {
    if(confirm("Are you sure you want to delete this property? This is irreversible."))
      if(p._id)
        this._diagramDomainService.deleteAProperty(p._id.toString()).subscribe(res => {window.location.reload();})
  }

}
