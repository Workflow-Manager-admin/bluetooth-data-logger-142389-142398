import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

// Chart.js must be included as a dependency
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-realtime-chart',
  template: `<canvas #chartCanvas></canvas>`,
  styleUrls: ['./realtime-chart.component.css']
})
/**
 * Displays live chart for streamed numeric data.
 */
export class RealtimeChartComponent implements OnChanges, AfterViewInit {
  @Input() data: { timestamp: Date, value: number }[] = [];
  @ViewChild('chartCanvas', { static: true }) chartRef!: ElementRef<HTMLCanvasElement>;
  chart: Chart | null = null;

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.chart) {
      this.updateChart();
    }
  }

  // PUBLIC_INTERFACE
  /** 
   * (Re)creates chart instance
   */
  createChart() {
    if (this.chart) this.chart.destroy();
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.data.map(d => d.timestamp.toLocaleTimeString()),
        datasets: [{
          label: 'Value',
          data: this.data.map(d => d.value),
          borderColor: '#1976d2',
          backgroundColor: 'rgba(25,118,210,0.15)',
          pointRadius: 2,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#424242' } }
        },
        scales: {
          x: { 
            ticks: { color: '#424242' },
            grid: { color: "#ececec" }
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#424242' },
            grid: { color: "#ececec" }
          }
        }
      }
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Efficient data update method for real-time use.
   */
  updateChart() {
    if (this.chart) {
      this.chart.data.labels = this.data.map(d => d.timestamp.toLocaleTimeString());
      this.chart.data.datasets[0].data = this.data.map(d => d.value);
      this.chart.update('none');
    }
  }
}
