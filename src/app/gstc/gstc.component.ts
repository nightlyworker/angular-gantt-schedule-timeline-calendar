import { Component, AfterViewInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import GSTC from 'gantt-schedule-timeline-calendar';

@Component({
  selector: 'gstc',
  templateUrl: './gstc.component.html',
  styleUrls: ['./gstc.component.scss']
})
export class GSTCComponent implements AfterViewInit {
  @Input() gstcState: any;
  @Output() gstcStateChange = new EventEmitter<any>();

  GSTCState: any;
  GSTC: any;

  constructor() {}
  @ViewChild('gstc', { read: ElementRef, static: true }) gstc: ElementRef;

  ngAfterViewInit() {
    const element = this.gstc.nativeElement;
    this.GSTC = GSTC({
      element,
      state: this.gstcState
    });
  }
}
