import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// import * as admin from 'firebase-admin';
import { AngularFirestore } from '@angular/fire/firestore';

export interface Item { name: string; cnpj: number; }


@Component({
  selector: 'app-opening-hours',
  templateUrl: './opening-hours.page.html',
  styleUrls: ['./opening-hours.page.scss'],
})
export class OpeningHoursPage implements OnInit {

  public myform: Array<FormGroup> = [];
  public errorMessage: string = '';
  public keyDoc = "43166808000156";


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
    { key: 0, value: 'Seg', visible: true },
    { key: 1, value: 'Ter', visible: true },
    { key: 2, value: 'Qua', visible: true },
    { key: 3, value: 'Qui', visible: true },
    { key: 4, value: 'Sex', visible: true },
    { key: 5, value: 'Sáb', visible: true },
    { key: 6, value: 'Dom', visible: true },
    { key: 7, value: 'Fer', visible: true },
  ];


  public submitted: boolean = false;
  // public openingHours: Array<any> = [


  constructor(public toastController: ToastController, public formBuilder: FormBuilder, public firestore: AngularFirestore) { }

  ngOnInit() {
    // this.myform.push(this.formBuilder.group({
    //   dayStart: new FormControl('', Validators.required),
    //   hourStart: new FormControl('', Validators.required),
    //   hourEnd: new FormControl('', Validators.required),
    //   dayEnd: new FormControl(''),
    // }));
  }

  addOpeningHour() {


    console.log("TESTE=>",this.daysOptions.map(item => item.visible === true));

    let indexRemove: Array<number> = [];


    let daysOptionsCopy = [];

    if (this.myform.length > 0) {
      this.myform.forEach(element => {
        const valueStart: number = Number(element.get('dayStart').value)

        const valueEnd: number = Number(element.get('dayEnd').value);

        console.log('valueStart->', valueStart);
        console.log('valueEnd->', valueEnd);

        //indexRemove.push(element.get('dayStart').value);
        if (valueEnd) {

          if (valueEnd === 7) {
            //feriado
            this.daysOptions.map(element => {
              if (element.key === valueStart || element.key === valueEnd) {
                element.visible = false
              }
            });

          } else {

            let index = valueStart;
            while (index != valueEnd && indexRemove.length !== 7) {

              indexRemove.push(Number(index));

              index++;
              if (index == 7) {
                index = 0;
              }

            }

            if (indexRemove.length != 7) {
              indexRemove.push(index);
            }

            console.log('daysTeste1=>', daysOptionsCopy)

            indexRemove.map(item => {
              // this.daysOptions = this.daysOptions.filter(item => {
              //   console.log('EEEEEEEitem=>', item)
              //   return item.key !== item
              // })
              this.daysOptions.map(element => {
                if (element.key === item) {
                  element.visible = false
                }
              });

            })
          }

          console.log('this.daysOptions =>', this.daysOptions)


          //indexRemove.push(element.get('dayEnd').value);
        } else {
          //Nao preencheu o dateEnd
          this.daysOptions.map(element => {
            if (element.key === valueStart) {
              element.visible = false
            }
          });
        }
      });
    }

    console.log(indexRemove);

    // const optionDaySpec = REMOVER OS DIAS


    this.myform.push(this.formBuilder.group({
      dayStart: new FormControl('', Validators.required),
      hourStart: new FormControl('', Validators.required),
      hourEnd: new FormControl('', Validators.required),
      dayEnd: new FormControl(''),
    }))
  }

  async verifyHour(i: number, type: number, hour: any) {

    if (type === 0) {
      this.myform[i].patchValue({
        hourStart: moment(hour).format("HH:mm"),
      })
    } else if (type === 1) {
      this.myform[i].patchValue({
        hourEnd: moment(hour).format("HH:mm"),
      })
    }

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
        this.submitted = false
        return;
      }
    });

    if (this.submitted) {
      // Start firebase admin
      // admin.initializeApp({
      //   credential: admin.credential.cert(serviceAccount),
      //   databaseURL: "https://simplefy-2e698.firebaseio.com"
      // });

      // admin.firestore().doc(`login/43166808000156`).update({
      //   openingHours : this.myform.map(item => item.value)
      // }).then().catch(async err => {
      //   //Caso dê algum problema, salva no collection de erro
      //   console.log('Erro no database de login');
      // });

      // console.log(this.firestore.collection('login').valueChanges());
      let teste = this.firestore.doc(`login/${this.keyDoc}`).update({
        openingHours: this.myform.map(item => item.value)
      });

    }

  }

}
