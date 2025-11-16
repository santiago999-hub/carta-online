import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaPublica } from './carta-publica';

describe('CartaPublica', () => {
  let component: CartaPublica;
  let fixture: ComponentFixture<CartaPublica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartaPublica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartaPublica);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
