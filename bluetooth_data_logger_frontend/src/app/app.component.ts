import { Component, OnInit } from '@angular/core';
import { BluetoothService, BluetoothDeviceInfo, BluetoothDataRecord } from './services/bluetooth.service';
import { LogService, LogSession } from './services/log.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Bluetooth Data Logger';
  availableDevices: BluetoothDeviceInfo[] = [];
  connectedDevice: BluetoothDeviceInfo | null = null;

  realtimeChartData: { timestamp: Date, value: number }[] = [];
  maxChartPoints = 100;

  sessions: LogSession[] = [];
  currentSession: LogSession | null = null;

  // Restore DI usage and reference
  // Mark accessed so linter doesn't complain; actual use is throughout class as this.bt/this.logger
  constructor(
    public bt: BluetoothService,
    public logger: LogService
  ) {
    void bt;
    void logger;
  }

  ngOnInit() {
    this.bt.getDevices().subscribe((devs: BluetoothDeviceInfo[]) => this.availableDevices = devs);
    this.bt.getConnectedDevice().subscribe((dev: BluetoothDeviceInfo | null) => {
      this.connectedDevice = dev;
      if (dev) {
        this.logger.startSession(`Session (${dev.name})`);
        this.currentSession = this.logger.getCurrentSession();
      } else {
        this.logger.endSession();
        this.currentSession = null;
      }
      this.sessions = this.logger.getSessions();
    });
    this.bt.getLastData().subscribe((record: BluetoothDataRecord) => {
      if (typeof record.payload === 'number') {
        this.realtimeChartData.push({timestamp: record.timestamp, value: record.payload});
        if (this.realtimeChartData.length > this.maxChartPoints) {
          this.realtimeChartData.shift();
        }
      }
      this.logger.logData(record);
      this.sessions = this.logger.getSessions();
    });
    this.sessions = this.logger.getSessions();
  }

  discoverDevices() {
    this.bt.discoverDevices();
  }
  connectDevice(dev: BluetoothDeviceInfo) {
    this.bt.connectToDevice(dev);
  }
  disconnectDevice() {
    this.bt.disconnect();
    this.realtimeChartData = [];
  }

  handleExport(format: 'csv' | 'json') {
    const session = this.currentSession || this.sessions[this.sessions.length-1];
    if (!session) return;
    if (format === 'csv') {
      const csv = this.sessionToCSV(session);
      this.downloadFile(csv, `log_${session.id}.csv`, 'text/csv');
    } else {
      const json = JSON.stringify(session.data, null, 2);
      this.downloadFile(json, `log_${session.id}.json`, 'application/json');
    }
  }
  handleClear() {
    this.logger.clearHistory();
    this.sessions = this.logger.getSessions();
    this.realtimeChartData = [];
  }
  private sessionToCSV(session: LogSession): string {
    if (!session.data.length) return '';
    const keys: string[] = Object.keys(session.data[0].payload || {value: ""});
    const rows = [
      ['timestamp', ...keys].join(','),
      ...session.data.map(r =>
        [r.timestamp.toISOString(), ...(Array.isArray(keys) ? keys.map(k => r.payload[k]) : [r.payload])].join(',')
      )
    ];
    return rows.join('\n');
  }
  // Disable lint for env globals in this function (browser only)
  /* eslint-disable-next-line */
  private downloadFile(data: string, filename: string, type: string) {
    // Use globalThis for universal context to avoid no-undef
    const win = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : undefined);
    const doc = typeof document !== 'undefined' ? document : (win ? win.document : undefined);
    if (win && doc) {
      const blob = new Blob([data], { type });
      const url = win.URL.createObjectURL(blob);
      const a = doc.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      doc.body.appendChild(a);
      a.click();
      if (typeof win.setTimeout === 'function') {
        win.setTimeout(() => {
          doc.body.removeChild(a);
          win.URL.revokeObjectURL(url);
        }, 0);
      } else {
        doc.body.removeChild(a);
        win.URL.revokeObjectURL(url);
      }
    }
  }
}
