import { Component, OnInit, OnDestroy } from '@angular/core';
import GSTC from 'gantt-schedule-timeline-calendar/src/index';
import { ItemHold, ItemMovement, SaveAsImage, Selection } from 'gantt-schedule-timeline-calendar/src/plugins/plugins';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {
  title = 'angular-gantt-schedule-timeline-calendar';

  gstcState: any;

  month: any;
  months: any[] = [];

  buttonClick() {
    this.gstcState.update('config.list.rows.1.label', 'changed!');
  }

  onMonthChange() {
    this.gstcState.update('config.chart.time', (time) => {
      time.from = dayjs(time.from)
        .startOf('year')
        .add(this.month, 'month')
        .valueOf();
      time.to = dayjs(time.from)
        .endOf('month')
        .valueOf();
      return time;
    });
  }

  previousMonth() {
    this.gstcState.update('config.chart.time', (time) => {
      time.from = dayjs(time.from)
        .subtract(1, 'month')
        .valueOf();
      time.to = dayjs(time.from)
        .endOf('month')
        .valueOf();
      this.month = dayjs(time.from).month();
      return time;
    });
  }

  nextMonth() {
    this.gstcState.update('config.chart.time', (time) => {
      time.from = dayjs(time.from)
        .add(1, 'month')
        .valueOf();
      time.to = dayjs(time.from)
        .endOf('month')
        .valueOf();
      this.month = dayjs(time.from).month();
      return time;
    });
  }

  createMonths() {
    for (let i = 0; i < 12; i++) {
      this.months.push({
        id: i,
        label: dayjs()
          .locale('pl')
          .startOf('year')
          .add(i, 'month')
          .format('MMMM')
      });
    }
    this.month = dayjs().month();
  }

  ngOnInit() {
    this.createMonths();
    const iterations = 100;
    const rows = {};
    for (let i = 0; i < iterations; i++) {
      const withParent = i > 0 && i % 2 === 0;
      const id = i.toString();
      rows[id] = {
        id,
        label: 'Room ' + i,
        parentId: withParent ? (i - 1).toString() : undefined,
        expanded: false,
        style: {
          current: i === 1 ? 'background: gray; color: white; font-weight: bold;' : '',
          children: i === 1 ? 'background: lightgray;' : '',
          gridBlock: {
            current: i === 1 ? 'background: gray;' : '',
            children: i === 1 ? 'background: lightgray;' : ''
          }
        }
      };
    }

    rows['1'].height = 80;
    rows['1'].moveable = false;
    rows['1'].label = 'Apartaments';
    rows['2'].label = 'Level 0';
    rows['3'].label = 'Level 1';
    rows['3'].parentId = '1';

    let startDayjs = GSTC.api
      .date()
      .startOf('month')
      .add(12, 'hours');
    let items = {};
    for (let i = 0; i < iterations; i++) {
      const id = i.toString();
      items[id] = {
        id,
        label: 'User id ' + i,
        time: {
          start: startDayjs
            .clone()
            .add(i, 'day')
            .valueOf(),
          end: startDayjs
            .clone()
            .add(i, 'day')
            .add(Math.round(Math.random() * 4) + 1, 'day')
            .endOf('day')
            .valueOf()
        },
        rowId: id,
        style: {
          current: i === 0 ? 'background: green;' : ''
        }
      };
    }

    items['0'].snapEnd = function snapEnd(time, diff, item) {
      const end = GSTC.api
        .date(time)
        .add(diff, 'milliseconds')
        .startOf('day')
        .add('12', 'hours')
        .valueOf();
      if (end <= item.time.start) {
        return time;
      }
      return end;
    };

    items['0'].moveable = ['0', '1', '2', '3'];
    items['0'].label = 'moveable inside rooms  0, 2, 3';

    items['1'].rowId = '12';

    items['2'].moveable = 'x';
    items['2'].label = 'moveable x';

    items['3'].moveable = 'y';
    items['3'].label = 'moveable y';

    items['4'].moveable = false;
    items['4'].label = 'not moveable';

    items['5'].resizeable = false;
    items['5'].label = 'not resizeable';

    items['6'].moveable = ['1', '2', '3', '6'];
    items['6'].label = 'moveable inside rooms  1, 2, 3, 6';

    const columns = {
      percent: 100,
      resizer: {
        inRealTime: true
      },
      data: {
        label: {
          id: 'label',
          data: 'label',
          expander: true,
          isHtml: true,
          width: 230,
          minWidth: 100,
          header: {
            content: 'Room'
          }
        }
      }
    };

    const from = GSTC.api
      .date()
      .startOf('month')
      .valueOf();
    const to = GSTC.api
      .date()
      .endOf('month')
      .valueOf();

    function snapStart(time, diff, item) {
      return GSTC.api
        .date(time)
        .add(diff, 'milliseconds')
        .startOf('day')
        .add('12', 'hours')
        .valueOf();
    }

    function snapEnd(time, diff, item) {
      const diffDays = Math.abs(
        GSTC.api
          .date(time + diff)
          .startOf('day')
          .diff(item.time.start, 'days')
      );
      const multipleTwo = Math.round(diffDays / 2);
      if (multipleTwo === 0) {
        return GSTC.api
          .date(time)
          .startOf('day')
          .add(12, 'hours')
          .valueOf();
      }
      const end = GSTC.api
        .date(item.time.start)
        .add(multipleTwo * 2, 'days')
        .startOf('day')
        .add('12', 'hours')
        .valueOf();
      if (end <= item.time.start) {
        return time;
      }
      return end;
    }

    const config = {
      plugins: [
        ItemHold({
          time: 1000,
          movementThreshold: 2,
          action(element, item) {
            alert(`item ${item.label} holded for 1s!`);
          }
        }),
        ItemMovement({
          moveable: true,
          resizeable: true,
          collisionDetection: true,
          snapStart,
          snapEnd
        }),
        SaveAsImage(),
        Selection()
      ],
      height: 40 * 12 + 94,
      list: {
        rows,
        columns,
        expander: {
          padding: 31
        }
      },
      chart: {
        spacing: 1,
        items,
        time: {
          period: 'day',
          from,
          to
        }
      },
      classNames: {},
      actions: {
        'list-column-header': [
          (element, data) => {
            const target = element.querySelector('.gantt-schedule-timeline-calendar__list-column-header-content');
            target.style['cursor'] = 'pointer';
            target.addEventListener('click', () => {
              target.style.color = '#' + Math.round(Math.random() * 999999);
              console.log(`${data.column.header.content} clicked!`);
            });
          }
        ],
        'list-column-row': [
          (element, data) => {
            if (data.row.id === '1') {
              element.style['font-weight'] = 'bold';
            }
          }
        ],
        'chart-timeline-grid-row-block': [
          function gridBlockAction(element, data) {
            // on create
            element.insertAdjacentHTML('beforeend', '<div class="dolar-bg-content">$</div>');
            let bg = element.querySelector('.dolar-bg-content');
            bg.onclick = (ev) => alert('dolar clicked!');
            if (data.row.id === '1') {
              bg.style['line-height'] = data.row.height + 'px';
              bg.style.visibility = 'visible';
            } else {
              bg.style.visibility = 'hidden';
            }
            return {
              update(element, changedData) {
                if (data.row.id === '1' && changedData.row.id !== '1') {
                  bg.style.visibility = 'hidden';
                } else if (data.row.id !== '1' && changedData.row.id === '1') {
                  bg.style['line-height'] = changedData.row.height + 'px';
                  bg.style.visibility = 'visible';
                }
                data = changedData;
              },
              destroy(element, data) {
                if (bg) bg.remove();
              }
            };
          }
        ]
      },
      locale: {
        name: 'pl',
        weekdays: 'Niedziela_Poniedziałek_Wtorek_Środa_Czwartek_Piątek_Sobota'.split('_'),
        weekdaysShort: 'Ndz_Pon_Wt_Śr_Czw_Pt_Sob'.split('_'),
        weekdaysMin: 'Nd_Pn_Wt_Śr_Cz_Pt_So'.split('_'),
        months: 'Styczeń_Luty_Marzec_Kwiecień_Maj_Czerwiec_Lipiec_Sierpień_Wrzesień_Październik_Listopad_Grudzień'.split(
          '_'
        ),
        monthsShort: 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
        weekStart: 1
      }
    };
    this.gstcState = GSTC.api.stateFromConfig(config);
    this.gstcState.subscribe('config.list.rows', (rows) => {
      console.log('rows changed', rows);
    });
    this.gstcState.subscribe(
      'config.chart.items.:id',
      (bulk, eventInfo) => {
        if (eventInfo.type === 'update' && eventInfo.params.id) {
          const itemId = eventInfo.params.id;
          console.log(`item ${itemId} changed`, this.gstcState.get('config.chart.items.' + itemId));
        }
      },
      { bulk: true }
    );
  }

  ngOnDestroy() {
    this.gstcState.destroy();
  }
}
