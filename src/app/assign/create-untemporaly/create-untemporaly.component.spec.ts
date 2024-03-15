import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUntemporalyComponent } from './create-untemporaly.component';

describe('CreateUntemporalyComponent', () => {
  let component: CreateUntemporalyComponent;
  let fixture: ComponentFixture<CreateUntemporalyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CreateUntemporalyComponent]
});
    fixture = TestBed.createComponent(CreateUntemporalyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
