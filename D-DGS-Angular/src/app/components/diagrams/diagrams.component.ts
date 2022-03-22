import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Diagram } from 'src/app/models/diagram';
import { DiagramDomainService } from 'src/app/services/diagramDomain.service';

const LOG_TOKEN: string = "LOG_TOKEN";
// LOG_TOKEN: null | FAILED | identificador del dominio del usuario
// * DEBE SUSTITUIRSE EN ALGÚN MOMENTO POR ALGO CIFRADO

@Component({
  selector: 'app-diagrams',
  templateUrl: './diagrams.component.html',
  styleUrls: ['./diagrams.component.css']
})
export class DiagramsComponent implements OnInit {

  public userHasDiagramas: boolean = false;
  public DOMAIN_KEY: string="";
  public userDiagrams: any[] = [];

  constructor(private _router: Router, private _diagramDomainService: DiagramDomainService) {
    let aux = sessionStorage.getItem(LOG_TOKEN);
    if(aux)
    {
      this.DOMAIN_KEY = aux;

      _diagramDomainService.getDiagrmasByDomain(this.DOMAIN_KEY).subscribe((diagrams: any) => {
        this.userDiagrams = diagrams;
      })
    }
    if(this.userDiagrams)
      this.userHasDiagramas = true;
    
  }

  ngOnInit(): void {
    if(sessionStorage.getItem(LOG_TOKEN) == null || sessionStorage.getItem(LOG_TOKEN) == "FAILED")
    {
      sessionStorage.removeItem(LOG_TOKEN);  
      this._router.navigateByUrl('/login');
    }
  }

  downloadDiagram(diagramToDownload: Diagram)
  {
    
  }

}
