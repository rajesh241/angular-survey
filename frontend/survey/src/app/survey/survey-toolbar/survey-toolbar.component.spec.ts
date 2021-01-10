import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyToolbarComponent } from './survey-toolbar.component';

describe('SurveyToolbarComponent', () => {
  let component: SurveyToolbarComponent;
  let fixture: ComponentFixture<SurveyToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
