import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardViewComponent } from './reward-view.component';

describe('RewardViewComponent', () => {
  let component: RewardViewComponent;
  let fixture: ComponentFixture<RewardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RewardViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
