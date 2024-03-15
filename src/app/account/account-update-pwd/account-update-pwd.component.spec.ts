import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountUpdatePwdComponent } from './account-update-pwd.component';

describe('AccountUpdatePwdComponent', () => {
  let component: AccountUpdatePwdComponent;
  let fixture: ComponentFixture<AccountUpdatePwdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccountUpdatePwdComponent]
    });
    fixture = TestBed.createComponent(AccountUpdatePwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
