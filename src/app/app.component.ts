import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {OverlayContainer} from '@angular/cdk/overlay';
import {ThemeService} from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @HostBinding('class') className = '';

  @Input() toggleControl = new FormControl(false)

  constructor(
    private overlayContainer: OverlayContainer,
    public themeService: ThemeService
  ) {
  }

  ngOnInit() {
    this.toggleControl.valueChanges.subscribe(val => {
      this.themeService.isTheme$.next(val)
      const darkModeClass = 'darkMode'
      this.className = val ? 'darkMode' : ''

      const classes = this.overlayContainer.getContainerElement().classList
      if (val) {
        classes.add(darkModeClass)
      } else {
        classes.remove(darkModeClass)
      }
    })
  }
}
