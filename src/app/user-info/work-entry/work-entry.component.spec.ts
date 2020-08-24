import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkEntryComponent } from './work-entry.component';

describe('EmpEntryComponent', () => {
  let component: WorkEntryComponent;
  let fixture: ComponentFixture<WorkEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkEntryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
