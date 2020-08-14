import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

@Injectable({
  providedIn: 'root',
})
export class IndexDBService {
  private db: IDBPDatabase<WEATHERDB>;
  constructor() {
    this.connectToDb();
  }

  async connectToDb() {
    this.db = await openDB<WEATHERDB>('weather-db', 1, {
      upgrade(db) {
        db.createObjectStore('weather-store');
      },
    });
  }

  addWeather(weather: any) {
    return this.db.put('weather-store', JSON.stringify(weather), 'weather');
  }

  deleteWeather(key: string) {
    return this.db.delete('weather-store', key);
  }
}

interface WEATHERDB extends DBSchema {
  'weather-store': {
    key: string;
    value: string;
  };
}
