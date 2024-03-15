import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTyperessourceComponent } from './list-typeressource.component';

describe('ListTyperessourceComponent', () => {
  let component: ListTyperessourceComponent;
  let fixture: ComponentFixture<ListTyperessourceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListTyperessourceComponent]
    });
    fixture = TestBed.createComponent(ListTyperessourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
