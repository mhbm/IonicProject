import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-opening-hours',
  templateUrl: './opening-hours.page.html',
  styleUrls: ['./opening-hours.page.scss'],
})
export class OpeningHoursPage implements OnInit {

  public myform: Array<FormGroup> = [];
  public errorMessage: string = '';

  form_messages = {
    'dayStart': [
      { type: 'required', message: 'Dia de início é obrigatório.' },
    ],
    'hourStart': [
      { type: 'required', message: 'Horário de início é obrigatório.' },
    ],
    'hourEnd': [
      { type: 'required', message: 'Horário final é obrigatório.' },
    ],
    
  };

  public daysOptions: Array<any> = [
    { key: 0, value: 'Seg' },
    { key: 1, value: 'Ter' },
    { key: 2, value: 'Qua' },
    { key: 3, value: 'Qui' },
    { key: 4, value: 'Sex' },
    { key: 5, value: 'Sáb' },
    { key: 6, value: 'Dom' },
    { key: 7, value: 'Fer' },
  ]

  public submitted : boolean = false;
  // public openingHours: Array<any> = [];

  // public openingHours : Array<any> = [
  //   {
  //     dayStart: 1,
  //     dayEnd: "",
  //     hourStart: "17:00",
  //     hourEnd: "21:00"
  //   },
  //   {
  //     dayStart: 2,
  //     dayEnd: 5,
  //     hourStart: "19:00",
  //     hourEnd: "23:00"
  //   } 
  // ]

  // public openingHours: any =
  //   [
  //     {
  //       day: 'Segunda-feira',
  //       selected: false,
  //       hours: [
  //         {
  //           start: '08:00',
  //           end: '12:00'
  //         }
  //       ]
  //     },
  //     {
  //       day: 'Terça-feira',
  //       selected: false,
  //       hours: [
  //         {
  //           start: '08:00',
  //           end: '12:00'
  //         }
  //       ]
  //     },
  //     {
  //       day: 'Quarta-feira',
  //       selected: false,
  //       hours: [
  //         {
  //           start: '08:00',
  //           end: '12:00'
  //         }
  //       ]
  //     },
  //     {
  //       day: 'Quinta-feira',
  //       selected: false,
  //       hours: [
  //         {
  //           start: '08:00',
  //           end: '12:00'
  //         }
  //       ]
  //     },
  //     {
  //       day: 'Sexta-feira',
  //       selected: false,
  //       hours: [
  //         {
  //           start: '08:00',
  //           end: '12:00'
  //         }
  //       ]
  //     },
  //     {
  //       day: 'Sábado',
  //       selected: false,
  //       hours: [
  //         {
  //           start: '08:00',
  //           end: '12:00'
  //         }
  //       ]
  //     },
  //     {
  //       day: 'Domingo',
  //       selected: false,
  //       hours: [
  //         {
  //           start: '08:00',
  //           end: '12:00'
  //         }
  //       ]
  //     },

  //   ]


  constructor(public toastController: ToastController, public formBuilder: FormBuilder) { }

  ngOnInit() {
    // this.myform.push(this.formBuilder.group({
    //   dayStart: new FormControl('', Validators.required),
    //   hourStart: new FormControl('', Validators.required),
    //   hourEnd: new FormControl('', Validators.required),
    //   dayEnd: new FormControl(''),
    // }));
  }

  addOpeningHour() {
    // this.openingHours[index].hours.push({
    //   start: '08:00',
    //   end: '12:00'
    // })
    // this.openingHours.push({
    //   dayStart: "",
    //   dayEnd: "",
    //   hourStart: "",
    //   hourEnd: ""
    // });

    this.myform.push(this.formBuilder.group({
      dayStart: new FormControl('', Validators.required),
      hourStart: new FormControl('', Validators.required),
      hourEnd: new FormControl('', Validators.required),
      dayEnd: new FormControl(''),
    }))
  }

  async verifyStartHour(i: number) {

    // const hourStart = moment(this.openingHours[i].hourStart).format("HH:mm");
    // const hourEnd = moment(this.openingHours[i].hourEnd).format("HH:mm");

    // if (this.openingHours[i].hourEnd != "" && this.openingHours[i].hourStart != "" && !moment(hourEnd, 'HH:mm').isAfter(moment(hourStart, 'HH:mm'))) {
    //   const toast = await this.toastController.create({
    //     message: 'O horário final precisa ser maior que o horário inicial.',
    //     duration: 2000,
    //     color: "danger",
    //   });
    //   toast.present();
    // }
  }

  onSubmit() {
    
    this.submitted = true;
    this.myform.forEach(async  item => {
      if (!item.valid) {
        const toast = await this.toastController.create({
              message: 'Por favor preencha todos os campos obrigatórios.',
              duration: 3000,
              color: "danger",
            });
            toast.present();
            return;
      }
    });

    this.submitted = false;

  }

}
