import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileRelatedService {

  constructor(private _httpClient: HttpClient) { }

  private diagramURL: string = "http://localhost:3000/diagrams/download"

  downloadFileExample(fileName: string, format: string) {
    this._httpClient.get(this.diagramURL+"/"+fileName).subscribe((response: any) => {
      console.log(response);
      
    })
  }

  getAJSONDiagram(diagramID: string) {
    let response;
    this._httpClient.get(this.diagramURL+"/"+diagramID);
  }
}