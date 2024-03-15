import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TyperessourceComponent } from './typeressource.component';

describe('TyperessourceComponent', () => {
  let component: TyperessourceComponent;
  let fixture: ComponentFixture<TyperessourceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TyperessourceComponent]
    });
    fixture = TestBed.createComponent(TyperessourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
