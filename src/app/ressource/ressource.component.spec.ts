import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RessourceComponent } from './ressource.component';

describe('RessourceComponent', () => {
  let component: RessourceComponent;
  let fixture: ComponentFixture<RessourceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RessourceComponent]
});
    fixture = TestBed.createComponent(RessourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
