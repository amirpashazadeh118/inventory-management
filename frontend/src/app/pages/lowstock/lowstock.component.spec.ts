import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowstockComponent } from './lowstock.component';

describe('LowstockComponent', () => {
  let component: LowstockComponent;
  let fixture: ComponentFixture<LowstockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LowstockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LowstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
