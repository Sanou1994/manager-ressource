import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationCustomerComponent } from './pagination.component';

describe('PaginationCustomerComponent', () => {
  let component: PaginationCustomerComponent;
  let fixture: ComponentFixture<PaginationCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [PaginationCustomerComponent]
});
    fixture = TestBed.createComponent(PaginationCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
