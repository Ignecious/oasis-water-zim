import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionScheduleComponent } from './collection-schedule.component';

describe('CollectionScheduleComponent', () => {
  let component: CollectionScheduleComponent;
  let fixture: ComponentFixture<CollectionScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionScheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollectionScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
