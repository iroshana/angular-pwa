import { Component, OnInit, Input } from '@angular/core';
import { WeatherService } from '../weather.service';
import { SwUpdate, SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {
  @Input('location') location: string;
  weathersubscription: any;
  errText: string = 'ssdsfsd';
  temp: number;
  desc: string;
  weatherico: string;
  country: string;
  city: string;
  dataModel: any;
  showResult: boolean = false;
  readonly VAPID_KEY =
    'BOKsuMzDFtbrgbCGx0066ikZhkom9mdXd_6BPipiTbqjqcUUnbzM2v9D1qy5aFYZt-wAcL2scOxXaNbYAwxy5nY';

  constructor(
    private swUpdates: SwUpdate,
    private weatherService: WeatherService,
    private swPush: SwPush
  ) {
    swUpdates.available.subscribe((event) => {
      //this.update = true;
      swUpdates.activateUpdate().then(() => document.location.reload());
    });
  }

  loadWeather() {
    this.showResult = false;
    if (this.location) {
      this.weathersubscription = this.weatherService
        .getWeather(this.location)
        .subscribe(
          (data) => {
            this.dataModel = data;
            this.errText = '';
            this.temp = Math.round(this.dataModel.main.temp);
            this.desc = this.dataModel.weather[0].description;
            this.weatherico =
              'http://openweathermap.org/img/w/' +
              this.dataModel.weather[0].icon +
              '.png';
            this.city = this.dataModel.name;
            this.country = this.dataModel.sys.country;
            //this.getLocalTime(data.coord.lat, data.coord.lon);
            this.showResult = true;
          },
          (error) => {
            this.errText = error;
          }
        );
    } else {
      alert('Location is required');
    }
  }

  clearData() {
    this.showResult = false;
    this.location = '';
  }

  reloadCache() {
    if (this.swUpdates.isEnabled) {
      this.swUpdates.available.subscribe(() => {
        if (confirm('New version available! would you like to update?')) {
          window.location.reload();
        }
      });
    }
  }

  ngOnInit(): void {
    this.reloadCache();
  }

  subscribeToNotification() {
    if (this.swUpdates.isEnabled) {
      this.swPush
        .requestSubscription({
          serverPublicKey: this.VAPID_KEY,
        })
        .then((sub) => {
          this.weatherService.postSubscription(sub).subscribe();
        })
        .catch(console.error);
    }
  }

  saveWeatherData() {
    let weatherObj = {
      city: this.city,
      country: this.country,
      temp: this.temp,
      desc: this.desc,
    };

    this.weatherService.postDataSync(weatherObj);

    this.clearData();
  }
}
