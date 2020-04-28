import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { Platform } from '@angular/cdk/platform';


import { HomePageRoutingModule } from './home-routing.module';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import '../icons';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HttpClientModule,       // (Required) For share counts
    ShareButtonsModule
  ],
  declarations: [HomePage],
  providers: [Platform],
})
export class HomePageModule {}
