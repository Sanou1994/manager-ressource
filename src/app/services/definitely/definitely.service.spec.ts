import { TestBed } from '@angular/core/testing';

import { DefinitelyService } from './definitely.service';

describe('DefinitelyService', () => {
  let service: DefinitelyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefinitelyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
