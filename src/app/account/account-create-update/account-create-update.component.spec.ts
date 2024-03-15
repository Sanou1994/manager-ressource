import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCreateUpdateComponent } from './account-create-update.component';

describe('AccountCreateUpdateComponent', () => {
  let component: AccountCreateUpdateComponent;
  let fixture: ComponentFixture<AccountCreateUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccountCreateUpdateComponent]
    });
    fixture = TestBed.createComponent(AccountCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
