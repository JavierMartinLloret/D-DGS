import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesingStrategyComponent } from './desing-strategy.component';

describe('DesingStrategyComponent', () => {
  let component: DesingStrategyComponent;
  let fixture: ComponentFixture<DesingStrategyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesingStrategyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesingStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
