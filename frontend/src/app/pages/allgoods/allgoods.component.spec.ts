import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllgoodsComponent } from './allgoods.component';

describe('AllgoodsComponent', () => {
  let component: AllgoodsComponent;
  let fixture: ComponentFixture<AllgoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllgoodsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllgoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
