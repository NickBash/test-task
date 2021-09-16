import {Component, OnInit} from '@angular/core';
import {EChartsOption} from 'echarts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  randomData() {
    const lines: any[] = []
    while (lines.length < 7) {
      const rand = 2000 + Math.random() * (2000 + 1);
      lines.push(Math.floor(rand))
    }
    return lines
  }

  chartOption: EChartsOption = {
    title: {
      text: 'Сравнение с эталоном'
    },
    xAxis: {
      type: 'category',
      data: [
        'Пн',
        'Вт',
        'Ср',
        'Чт',
        'Пт',
        'Сб',
        'Вс'],
    },
    yAxis: {
      type: 'value',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis'
    },
    series: [
      {
        data: this.randomData(),
        type: 'line',
      },
      {
        data: this.randomData(),
        type: 'line',
      },
    ],
  };

}
