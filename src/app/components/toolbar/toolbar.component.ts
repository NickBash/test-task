import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() toggleControl = new FormControl(false)

  constructor(
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.toggleControl.valueChanges.subscribe(val => {
      this.themeService.isTheme$.next(val)
    })
  }

}
