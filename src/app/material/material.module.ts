import { NgModule } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

const modules = [
  MatDialogModule,
  MatButtonModule,
  MatSlideToggleModule,
  MatIconModule,
  MatToolbarModule,
]

@NgModule({
  imports: [modules],
  exports: [modules],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class MaterialModule { }
