import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GivenTemporalyComponent } from './given-temporaly.component';

describe('GivenTemporalyComponent', () => {
  let component: GivenTemporalyComponent;
  let fixture: ComponentFixture<GivenTemporalyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GivenTemporalyComponent]
    });
    fixture = TestBed.createComponent(GivenTemporalyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
