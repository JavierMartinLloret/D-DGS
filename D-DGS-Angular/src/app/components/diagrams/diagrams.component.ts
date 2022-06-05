import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Diagram } from 'src/app/models/diagram';
import { DiagramDomainService } from 'src/app/services/diagramDomain.service';
import { FileRelatedService } from 'src/app/services/file-related.service';

const LOG_TOKEN: string = "LOG_TOKEN";
// LOG_TOKEN: null | FAILED | identificador del dominio del usuario
// * DEBE SUSTITUIRSE EN ALGÚN MOMENTO POR ALGO CIFRADO

@Component({
  selector: 'app-diagrams',
  templateUrl: './diagrams.component.html',
  styleUrls: ['./diagrams.component.css']
})
export class DiagramsComponent implements OnInit {

  public userHasDiagrams: boolean = false;
  public DOMAIN_KEY: string="";

  public userDiagrams: any = [];

  constructor(private _router: Router, private _diagramDomainService: DiagramDomainService) {
    let aux = sessionStorage.getItem(LOG_TOKEN);
    if(aux)
    {
      this.DOMAIN_KEY = aux;
      this._diagramDomainService.getAllDiagramsOfAnUser(this.DOMAIN_KEY).subscribe(res => {
        console.log(res);
        this.userDiagrams = res;
      })
    }
    
  }

  ngOnInit(): void {
    if(sessionStorage.getItem(LOG_TOKEN) == null || sessionStorage.getItem(LOG_TOKEN) == "FAILED")
    {
      sessionStorage.removeItem(LOG_TOKEN);  
      this._router.navigateByUrl('/login');
    }
    if(this.userDiagrams.length != 0)
      this.userHasDiagrams = true;
  }

  visualizeDiagram(): void
  {
    console.log("TRABAJO EN CURSO");
    
  }

  downloadDiagram(): void
  {
    console.log("TRABAJO EN CURSO");
    
  }

  deleteDiagram(diagram: Diagram): void
  {
    if(diagram._id != undefined)
      this._diagramDomainService.deleteADiagram(diagram._id.toString()).subscribe(res => {window.location.reload();})
  }

  debugmethod()
  {
    //console.log(this.userDiagrams != undefined);
    console.log(this.userHasDiagrams);
    
    //this.userHasDiagrams = this.userHasDiagrams ? false : true;
  }
}
