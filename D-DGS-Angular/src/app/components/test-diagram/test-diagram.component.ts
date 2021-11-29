import { Component, OnInit } from '@angular/core';
import { DataSet } from 'vis-data';
import { Network } from 'vis-network';

@Component({
  selector: 'app-test-diagram',
  templateUrl: './test-diagram.component.html',
  styleUrls: ['./test-diagram.component.css']
})
export class TestDiagramComponent implements OnInit {

  public container: any;
  public nodes: any;
  public edges: any;
  public data: any;
  public options: any;
  public network: any;

  constructor() { }

  ngOnInit(): void {
    this.container = document.getElementById("idDiagrama");
    this.nodes = document.getElementById("idNodos");

    this.nodes = new DataSet([
      { id: 1, label: "Nodo 1" },
      { id: 2, label: "Nodo 2" }
    ]);

    this.edges = new DataSet([
      { id:1, from: 1, to: 2 }
    ]);

    var data = {
      nodes: this.nodes,
      edges: this.edges
    }

    this.options = {  };

    if(this.container != null)
    {
      this.network = new Network(this.container, data, this.options);
    }
  }

  showNodes()
  {
    console.log(this.nodes);
  }
}
