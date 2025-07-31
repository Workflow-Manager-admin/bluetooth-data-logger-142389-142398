import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BluetoothDeviceInfo } from '../../services/bluetooth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
/**
 * Sidebar component for device discovery and connection management.
 */
export class SidebarComponent {
  @Input() availableDevices: BluetoothDeviceInfo[] = [];
  @Input() connectedDevice: BluetoothDeviceInfo | null = null;
  @Output() discoverClicked = new EventEmitter<void>();
  @Output() connect = new EventEmitter<BluetoothDeviceInfo>();
  @Output() disconnect = new EventEmitter<void>();

  // Handles device menu actions
  handleConnect(device: BluetoothDeviceInfo) {
    this.connect.emit(device);
  }
  handleDisconnect() {
    this.disconnect.emit();
  }
  handleDiscover() {
    this.discoverClicked.emit();
  }
}
