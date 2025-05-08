import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoSectionComponent } from './demo-section.component';

describe('DemoSectionComponent', () => {
  let component: DemoSectionComponent;
  let fixture: ComponentFixture<DemoSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemoSectionComponent]
    });
    fixture = TestBed.createComponent(DemoSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
