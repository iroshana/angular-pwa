import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IndexDBService } from './services/index-db.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  public apiURL = 'https://api.openweathermap.org/data/2.5/weather?q=';
  public appID = '&appid=4d54b7ce54236f8a4be07c0a15e5ca97';
  public unit = 'metric';
  public notificationUrl = 'http://localhost:3000/subscribe';
  private readonly dataSaveUrl = 'http://localhost:3000/weather';

  constructor(
    private http: HttpClient,
    private indexDBService: IndexDBService
  ) {}

  getWeather(location: string) {
    return this.http
      .get(this.apiURL + location + this.appID + '&units=' + this.unit)
      .pipe(catchError(this.handlError));
  }

  postSubscription(sub: PushSubscription) {
    return this.http
      .post(this.notificationUrl, sub)
      .pipe(catchError(this.handlError));
  }

  handlError(error) {
    return throwError(error.error.message);
  }

  postDataSync(weather: any) {
    this.http.post(this.dataSaveUrl, weather).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        this.indexDBService
          .addWeather(weather)
          .then(this.backgroundSync)
          .catch(console.log);
        //this.backgroundSync();
      }
    );
  }

  backgroundSync() {
    navigator.serviceWorker.ready
      .then((swRegistration) => swRegistration.sync.register('post-data'))
      .catch(console.log);
  }
}
