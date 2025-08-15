import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsoldComponent } from './reportsold.component';

describe('ReportsoldComponent', () => {
  let component: ReportsoldComponent;
  let fixture: ComponentFixture<ReportsoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsoldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
