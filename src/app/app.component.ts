import { Component, OnInit } from '@angular/core';
import GSTC from 'gantt-schedule-timeline-calendar';
import { ItemHold, ItemMovement, SaveAsImage } from 'gantt-schedule-timeline-calendar/dist/plugins.js';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
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
      time.to = dayjs(time.to)
        .startOf('year')
        .add(this.month, 'month')
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
      time.to = dayjs(time.to)
        .subtract(1, 'month')
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
      time.to = dayjs(time.to)
        .add(1, 'month')
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
        expanded: false
      };
    }

    rows['1'].height = 80;
    rows['1'].moveable = false;
    rows['1'].label = 'Apartaments';
    rows['2'].label = 'Level 0';
    rows['3'].label = 'Level 1';
    rows['3'].parentId = '1';

    let startDayjs = GSTC.api.date().startOf('month');
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
        rowId: id
      };
    }

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
    let snapStart = [];
    let snapEnd = [];
    const diffDays = GSTC.api.date(to).diff(from, 'days') + 20;
    for (let i = 0; i < diffDays; i++) {
      //snap to 12:00
      snapStart.push(
        GSTC.api
          .date(from)
          .add(i - 10, 'days')
          .add(12, 'hours')
          .valueOf()
      );
    }
    for (let i = 0; i < diffDays; i += 3) {
      snapEnd.push(
        GSTC.api
          .date(from)
          .add(i - 10, 'days')
          .add(3, 'days')
          .add(12, 'hours')
          .valueOf()
      );
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
        SaveAsImage()
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
        if (eventInfo.type === 'update') {
          const itemId = eventInfo.params.id;
          console.log(`item ${itemId} changed`, this.gstcState.get('config.chart.items.' + itemId));
        }
      },
      { bulk: true }
    );
  }
}
