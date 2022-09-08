import { Component, AfterViewInit } from '@angular/core';
import { DataSet } from "vis-data";
import { Network } from "vis-network";

const LOG_TOKEN: string = "LOG_TOKEN";
const RewardSetID: string = "62f38f7838c96401dd15c50a";

@Component({
  selector: 'app-test-diagram',
  templateUrl: './test-diagram.component.html',
  styleUrls: ['./test-diagram.component.css']
})
export class TestDiagramComponent implements AfterViewInit {

  public diagram : any;
  public data: any;
  public nodes: any;
  public edges : any;
  public options : any;
  public network : any;


  constructor() {
    
  }

  ngAfterViewInit(): void {
    this.diagram = document.getElementById("myNetwork");
    this.nodes = document.getElementById("nodesID");

    this.nodes = new DataSet();
    this.edges = new DataSet();

    this.data = {
      nodes: this.nodes,
      edges: this.edges
    }
    this.options = {};
    if(this.diagram != null)
    {
      this.network = new Network(this.diagram, this.data, this.options);
      console.log("POLLA");
      
    }
    else
    {
      console.log("F")
    }
    
  }

  debug()
  {
    this.nodes.add([{id: 1, label: "POLLA1 "}, {id: 2, label: "POLLA 2"}]);
    this.edges.add({from: 1, to: 2});
    console.log(this.network)
  }

  unlogUser()
  {
    sessionStorage.removeItem(LOG_TOKEN)
  }  
}
