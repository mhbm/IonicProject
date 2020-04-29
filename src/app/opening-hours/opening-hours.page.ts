import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// import * as admin from 'firebase-admin';
import { AngularFirestore } from '@angular/fire/firestore';
import * as clone from 'clone';

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
  public count: number = 0;

  public form_messages = {
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

  public arrayDaysOptions = [];

  public submitted: boolean = false;

  public controlOptions: boolean = true;

  constructor(public toastController: ToastController, public formBuilder: FormBuilder, public firestore: AngularFirestore) { }

  ngOnInit() {
  }

  async addOpeningHour() {

    let indexRemove: Array<number> = [];

    if (!this.controlOptions) {
      const toast = await this.toastController.create({
        message: 'Todos os dias foram preenchidos.',
        duration: 3000,
        color: "danger",
      });
      toast.present();
    } else {

      let daysOptionsCopy = [];
      daysOptionsCopy = clone(this.daysOptions);

      if (this.myform.length > 0) {
        this.myform.forEach(element => {
          const valueStart: number = Number(element.get('dayStart').value)
          const valueEnd: number = Number(element.get('dayEnd').value);

          //indexRemove.push(element.get('dayStart').value);
          if (valueEnd) {

            if (valueEnd === 7) {
              //feriado
              daysOptionsCopy.map(element => {
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

              indexRemove.map(item => {
                daysOptionsCopy.map(element => {
                  if (element.key === item) {
                    element.visible = false
                  }
                });
              })
            }

            //indexRemove.push(element.get('dayEnd').value);
          } else {
            //Nao preencheu o dateEnd
            daysOptionsCopy.map(element => {
              if (element.key === valueStart) {
                element.visible = false
              }
            });
          }
        });
      }

      const verifyOptionsAvailable = daysOptionsCopy.filter(item => item.visible === true);


      if (verifyOptionsAvailable.length == 0) {
        this.controlOptions = false;
        const toast = await this.toastController.create({
          message: 'Todos os dias foram preenchidos.',
          duration: 3000,
          color: "danger",
        });
        toast.present();
      } else {
        this.arrayDaysOptions.push(daysOptionsCopy.map(e => e));

        this.myform.push(this.formBuilder.group({
          dayStart: new FormControl('', Validators.required),
          hourStart: new FormControl('', Validators.required),
          hourEnd: new FormControl('', Validators.required),
          dayEnd: new FormControl(''),
        }));
      }
    }
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

  async onSubmit() {

    this.submitted = true;
    this.myform.forEach(item => {
      if (!item.valid) {
        this.toastController.create({
          message: 'Por favor preencha todos os campos obrigatórios.',
          duration: 3000,
          color: "danger",
        }).then(toast => {
          toast.present();

        });
        this.submitted = false
      }
    });

    if (this.submitted) {
      console.log(this.firestore.collection('login').valueChanges());
      this.firestore.doc(`login/${this.keyDoc}`).update({
        // openingHours: this.formattedDocumentFirebase()
        openingHours: this.myform.map(item => item.value)
      }).then().catch(err => {
        console.log(err);
      });

    }

  }

  // formattedDocumentFirebase() {


  //   let arrayDays = [];

  //   this.myform.map((form, index) => {
  //     const dayStart = Number(form.value.dayStart);
  //     const dayEnd = Number(form.value.dayEnd);
  //     const hourStart = form.value.hourStart;
  //     const hourEnd = form.value.hourEnd;

  //     const arrayDayOption = this.checkDaysAvailiable(dayStart, dayEnd, index);

  //     for (const iterator of arrayDayOption) {
  //       const position = arrayDays.indexOf(iterator);

  //       if (position === -1) {
  //         arrayDays.push({
  //           position : iterator,
  //           hourStart,
  //           hourEnd,
  //         });
  //       }
  //     }
  //   });
  //   arrayDays.sort();

  //   let formattedDays = [];
  //   for (let cont = 0; cont < 8; cont++) {

  //     const item = arrayDays.find(e => e.position === cont);
  //     console.log('item->',item);
  //     if (!item) {
  //       console.log('1111')
  //       formattedDays.push({
  //         status: false,
  //       });
  //     } else {
  //       console.log('222')
  //       formattedDays.push({
  //         status: true,
  //         hourStart : item.hourStart,
  //         hourEnd : item.hourEnd,
  //       })
  //     }
      
  //   }
  //   console.log('arrayDays->', arrayDays);
  //   console.log('formattedDays->', formattedDays);

  //   return formattedDays;

  // }


  checkDaysAvailiable(dayStart: number, dayEnd: number, index: number): Array<number> {
    let arrayDays: Array<number> = [];

    if (dayEnd) {

      if (dayEnd === 7) {
        //feriado
        arrayDays.push(7);
        arrayDays.push(dayStart);
      } else {

        let i = dayStart;
        while (i != dayEnd && arrayDays.length !== 7) {
          arrayDays.push(Number(i));
          i++;
          if (i == 7) {
            i = 0;
          }
        }

        if (arrayDays.length != 7) {
          arrayDays.push(i);
        }
      }
    } else {
      //Nao preencheu o dateEnd
      arrayDays.push(dayStart);
    }

    this.arrayDaysOptions[index].map(element => {
      if (!element.visible) {
        const position = arrayDays.indexOf(element.key);
        if (position === -1) {
          //nao possui
          arrayDays.push(element.key)
        }
      }
    });

    arrayDays.sort();

    return arrayDays;
  }

  removeItem(index: number) {
    this.arrayDaysOptions.splice(index, 1);
    this.myform.splice(index, 1);
  }

  renewOptions(index: number) {

    const newDayStart: number = Number(this.myform[index].value.dayStart);
    const newDayEnd: number = Number(this.myform[index].value.dayEnd);

    let arrayDays = [];

    //indexRemove.push(element.get('dayStart').value);
    if (newDayEnd) {

      if (newDayEnd === 7) {
        //feriado
        arrayDays.push(7);
        arrayDays.push(newDayStart);
      } else {

        let i = newDayStart;
        while (i != newDayEnd && arrayDays.length !== 7) {
          arrayDays.push(Number(i));
          i++;
          if (i == 7) {
            i = 0;
          }
        }

        if (arrayDays.length != 7) {
          arrayDays.push(i);
        }
      }
    } else {
      //Nao preencheu o dateEnd
      arrayDays.push(newDayStart);
    }

    this.arrayDaysOptions[index].map(element => {
      if (!element.visible) {
        const position = arrayDays.indexOf(element.key);
        if (position === -1) {
          //nao possui
          arrayDays.push(element.key)
        }
      }
    });

    arrayDays.sort();
    if (this.arrayDaysOptions.length > 1) {
      for (let i = index + 1; i < this.arrayDaysOptions.length; i++) {
        this.arrayDaysOptions[i].map(element => {
          const position = arrayDays.indexOf(element.key);
          if (position !== -1) {
            element.visible = false;
          } else {
            element.visible = true;
          }
        });

        this.myform[i].patchValue({
          dayStart: "",
          dayEnd: "",
        })
      }
    }
  }
}
