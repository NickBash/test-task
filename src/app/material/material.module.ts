import { NgModule } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

const modules = [
  MatDialogModule,
  MatButtonModule
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
