import { TestBed } from '@angular/core/testing';

import { TypeRessourceService } from './type-ressource.service';

describe('TypeServiceService', () => {
  let service: TypeRessourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeRessourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
