import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTemporalyComponent } from './create-temporaly.component';

describe('CreateTemporalyComponent', () => {
  let component: CreateTemporalyComponent;
  let fixture: ComponentFixture<CreateTemporalyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CreateTemporalyComponent]
});
    fixture = TestBed.createComponent(CreateTemporalyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
