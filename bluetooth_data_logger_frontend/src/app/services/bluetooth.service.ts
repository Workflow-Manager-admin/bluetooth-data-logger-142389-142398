// removed unnecessary disable directive
// Only browser environment: BluetoothRemoteGATT*, navigator, RequestDeviceOptions
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

declare var navigator: any; // For lint compat

// BluetoothDeviceInfo summarizes device details relevant to UI
export interface BluetoothDeviceInfo {
  name: string;
  id: string;
  gatt?: any;
  device: any;
}

export interface BluetoothDataRecord {
  timestamp: Date;
  payload: any;
}

// PUBLIC_INTERFACE
@Injectable({
  providedIn: 'root'
})
/**
 * Service to manage Bluetooth device discovery, connections, and streaming data.
 * Uses the browser's Web Bluetooth API.
 */
export class BluetoothService {
  private devices: BehaviorSubject<BluetoothDeviceInfo[]> = new BehaviorSubject<BluetoothDeviceInfo[]>([]);
  private connectedDevice: BehaviorSubject<BluetoothDeviceInfo | null> = new BehaviorSubject<BluetoothDeviceInfo | null>(null);
  private lastData: Subject<BluetoothDataRecord> = new Subject<BluetoothDataRecord>();
  private deviceCharacteristic: any = null;

  getDevices(): Observable<BluetoothDeviceInfo[]> {
    return this.devices.asObservable();
  }

  getConnectedDevice(): Observable<BluetoothDeviceInfo | null> {
    return this.connectedDevice.asObservable();
  }

  getLastData(): Observable<BluetoothDataRecord> {
    return this.lastData.asObservable();
  }

  // PUBLIC_INTERFACE
  /**
   * Request user to select and pair with a Bluetooth device advertising a GATT service.
   */
  async discoverDevices() {
    try {
      if (typeof navigator === 'undefined' || !navigator.bluetooth) {
        throw new Error('Web Bluetooth not supported in this context');
      }
      const options = {
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'device_information']
      };
      const device = await navigator.bluetooth.requestDevice(options);
      const infos: BluetoothDeviceInfo[] = [{
        name: device.name ?? '(Unnamed Device)',
        id: device.id,
        device,
      }];
      this.devices.next(infos);
    } catch (err) {
      console.error('Bluetooth discovery error', err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Connects to a Bluetooth device and tries to listen to one characteristic.
   */
  async connectToDevice(deviceInfo: BluetoothDeviceInfo) {
    try {
      const gatt = await deviceInfo.device.gatt?.connect();
      const services = await gatt?.getPrimaryServices();
      let found = false;
      if (services) {
        for (const svc of services) {
          const characteristics = await svc.getCharacteristics();
          for (const char of characteristics) {
            if (char.properties.notify || char.properties.indicate || char.properties.read) {
              this.deviceCharacteristic = char;
              await char.startNotifications();
              char.addEventListener('characteristicvaluechanged', (event: any) => {
                const value = this.parseData(event.target.value);
                this.lastData.next({timestamp: new Date(), payload: value});
              });
              found = true;
              break;
            }
          }
          if (found) break;
        }
      }
      this.connectedDevice.next({...deviceInfo, gatt});
    } catch (err) {
      console.error('Error connecting to device', err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Disconnects the current Bluetooth device and stops listening for data.
   */
  disconnect() {
    if (this.connectedDevice.value?.gatt?.connected) {
      this.connectedDevice.value.device.gatt?.disconnect();
    }
    this.connectedDevice.next(null);
    this.deviceCharacteristic = null;
  }

  /**
   * Parses DataView payload from the device characteristic into value for charts/log.
   */
  private parseData(dataView: DataView): any {
    if (dataView.byteLength >= 4) {
      return dataView.getFloat32(0, true);
    }
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(dataView.buffer);
  }
}
