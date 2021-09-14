import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramExampleComponent } from './diagram-example.component';

describe('DiagramExampleComponent', () => {
  let component: DiagramExampleComponent;
  let fixture: ComponentFixture<DiagramExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiagramExampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
