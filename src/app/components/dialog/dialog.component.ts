import {Component, HostBinding, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
}
