import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GSTCComponent } from './gstc.component';

describe('GSTCComponent', () => {
  let component: GSTCComponent;
  let fixture: ComponentFixture<GSTCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GSTCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GSTCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
