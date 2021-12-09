import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramCreationComponent } from './diagram-creation.component';

describe('DiagramCreationComponent', () => {
  let component: DiagramCreationComponent;
  let fixture: ComponentFixture<DiagramCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiagramCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
