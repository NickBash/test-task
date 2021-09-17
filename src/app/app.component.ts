import {Component, HostBinding, OnInit} from '@angular/core';
import {ThemeService} from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @HostBinding('class') className = '';

  constructor(
    public themeService: ThemeService
  ) { }

  ngOnInit() {
    this.themeService.isTheme$.subscribe(val => {
      this.className = val ? 'darkMode' : ''
    })
  }
}
