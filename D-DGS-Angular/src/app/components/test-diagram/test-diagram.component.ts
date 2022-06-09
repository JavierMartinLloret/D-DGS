import { Component, OnInit } from '@angular/core';

const LOG_TOKEN: string = "LOG_TOKEN";

@Component({
  selector: 'app-test-diagram',
  templateUrl: './test-diagram.component.html',
  styleUrls: ['./test-diagram.component.css']
})
export class TestDiagramComponent implements OnInit {

  

  public userIsAdmin: boolean = true;

  constructor() { }

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
}
