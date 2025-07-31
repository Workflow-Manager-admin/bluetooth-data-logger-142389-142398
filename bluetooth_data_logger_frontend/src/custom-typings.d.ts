/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
export {};

declare global {
  interface BluetoothDevice {
    id: string;
    name?: string;
    gatt?: BluetoothRemoteGATTServer;
    addEventListener(type: string, listener: Function): void;
  }
  interface BluetoothRemoteGATTServer {
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryServices(service?: string): Promise<BluetoothRemoteGATTService[]>;
    connected?: boolean;
    device: BluetoothDevice;
  }
  interface BluetoothRemoteGATTService {
    uuid: string;
    getCharacteristics(): Promise<BluetoothRemoteGATTCharacteristic[]>;
  }
  interface BluetoothRemoteGATTCharacteristic {
    properties: {
      notify?: boolean;
      indicate?: boolean;
      read?: boolean;
    };
    startNotifications(): Promise<void>;
    addEventListener(event: string, listener: any): void;
  }
  interface Navigator {
    bluetooth: {
      requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
    };
  }
  interface RequestDeviceOptions {
    filters?: Array<{ services?: string[]; name?: string; namePrefix?: string }>;
    optionalServices?: string[];
    acceptAllDevices?: boolean;
  }
}
