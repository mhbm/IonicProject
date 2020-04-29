import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/firestore';


import { IonicModule } from '@ionic/angular';

import { OpeningHoursPageRoutingModule } from './opening-hours-routing.module';

import { OpeningHoursPage } from './opening-hours.page';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpeningHoursPageRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  declarations: [OpeningHoursPage]
})
export class OpeningHoursPageModule {}
