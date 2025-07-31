import { Injectable } from '@angular/core';
import { BluetoothDataRecord } from './bluetooth.service';

export interface LogSession {
  id: string;
  name: string;
  started: Date;
  ended?: Date;
  data: BluetoothDataRecord[];
}

// PUBLIC_INTERFACE
@Injectable({
  providedIn: 'root'
})
/**
 * Manages data logging for current and past sessions
 */
export class LogService {
  private sessions: LogSession[] = [];
  private currentSession: LogSession | null = null;

  startSession(name = 'Session'): LogSession {
    if (this.currentSession) this.endSession();
    const session: LogSession = {
      id: `${Date.now()}`,
      name,
      started: new Date(),
      data: []
    };
    this.currentSession = session;
    this.sessions.push(session);
    return session;
  }

  // PUBLIC_INTERFACE
  /**
   * End the current logging session.
   */
  endSession() {
    if (this.currentSession) {
      this.currentSession.ended = new Date();
      this.currentSession = null;
    }
  }

  // PUBLIC_INTERFACE
  logData(record: BluetoothDataRecord) {
    if (this.currentSession) {
      this.currentSession.data.push(record);
    }
  }

  // PUBLIC_INTERFACE
  getSessions(): LogSession[] {
    return [...this.sessions];
  }

  // PUBLIC_INTERFACE
  getCurrentSession(): LogSession | null {
    return this.currentSession;
  }

  // PUBLIC_INTERFACE
  clearHistory() {
    this.sessions.length = 0;
  }
}
