import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramCreationLastComponent } from './diagram-creation-last.component';

describe('DiagramCreationLastComponent', () => {
  let component: DiagramCreationLastComponent;
  let fixture: ComponentFixture<DiagramCreationLastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiagramCreationLastComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramCreationLastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
