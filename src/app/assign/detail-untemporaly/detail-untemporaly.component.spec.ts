import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailUntemporalyComponent } from './detail-untemporaly.component';

describe('DetailUntemporalyComponent', () => {
  let component: DetailUntemporalyComponent;
  let fixture: ComponentFixture<DetailUntemporalyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DetailUntemporalyComponent]
    });
    fixture = TestBed.createComponent(DetailUntemporalyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
