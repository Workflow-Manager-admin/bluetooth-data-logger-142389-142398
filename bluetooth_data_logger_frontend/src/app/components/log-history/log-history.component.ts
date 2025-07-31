import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LogSession } from '../../services/log.service';

@Component({
  selector: 'app-log-history',
  templateUrl: './log-history.component.html',
  styleUrls: ['./log-history.component.css'],
})
/**
 * Displays session history and export/download buttons.
 */
export class LogHistoryComponent {
  @Input() sessions: LogSession[] = [];
  @Input() currentSession: LogSession | null = null;
  @Output() exportFormat = new EventEmitter<'csv' | 'json'>();
  @Output() clearLogs = new EventEmitter<void>();

  handleExport(format: 'csv' | 'json') {
    this.exportFormat.emit(format);
  }
  handleClear() {
    this.clearLogs.emit();
  }
}
