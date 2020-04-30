import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'pdf',
    loadChildren: () => import('./pdf/pdf.module').then( m => m.PdfPageModule)
  },
  {
    path: 'pdf2',
    loadChildren: () => import('./pdf2/pdf2.module').then( m => m.Pdf2PageModule)
  },
  {
    path: 'opening-hours',
    loadChildren: () => import('./opening-hours/opening-hours.module').then( m => m.OpeningHoursPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
