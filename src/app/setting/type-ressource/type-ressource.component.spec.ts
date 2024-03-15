import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeRessourceComponent } from './type-ressource.component';

describe('TypeRessourceComponent', () => {
  let component: TypeRessourceComponent;
  let fixture: ComponentFixture<TypeRessourceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TypeRessourceComponent]
    });
    fixture = TestBed.createComponent(TypeRessourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
