import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OpeningHoursPage } from './opening-hours.page';

describe('OpeningHoursPage', () => {
  let component: OpeningHoursPage;
  let fixture: ComponentFixture<OpeningHoursPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpeningHoursPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OpeningHoursPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
