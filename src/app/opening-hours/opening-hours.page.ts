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

  //Variavel do array do formGroud
  public myform: Array<FormGroup> = [];

  //chave do documento para salvar
  public keyDoc = "43166808000156";


  //Variavel com as mensagens de erro de cada campo
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

  //Array com as opções de cada dia
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

  //Array de daysOptions
  public arrayDaysOptions = [];

  //Variavel de submitted
  public submitted: boolean = false;

  //Variavel controladora para verificar se pode adicionar mais dias
  public controlOptions: boolean = true;

  constructor(public toastController: ToastController, public formBuilder: FormBuilder, public firestore: AngularFirestore) { }

  ngOnInit() {
  }


  private __showToaster(message: string, color: string) {
    const toast = this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
    }).then(toast => toast.present());
  }

  /**
  * verifyHour
  * 
  * @author Mateus Macedo
  * @param i Posição do array
  * @param type Valor 1 ou 0, 0 se refere ao START e 1 se refere ao END
  * @param hour Valor da hora
  * @return {void}
  */

  addOpeningHour() {

    let indexRemove: Array<number> = [];

    if (!this.controlOptions) {
      this.__showToaster('Todos os dias foram preenchidos', 'danger');
    } else {

      let daysOptionsCopy = [];
      daysOptionsCopy = clone(this.daysOptions);

      if (this.myform.length > 0) {

        this.myform.forEach(element => {

          const valueStart: number = Number(element.get('dayStart').value)
          const valueEnd: number = Number(element.get('dayEnd').value);

          if (valueEnd || element.value.dayEnd === "0") {
            if (valueEnd === 7) {
              //feriado
              daysOptionsCopy.map(element => {
                if (element.key === valueStart || element.key === valueEnd) {
                  element.visible = false
                }
              });

            } else {

              let index = valueStart;
              while (index !== valueEnd && indexRemove.length !== 7) {

                indexRemove.push(Number(index));

                index++;
                if (index == 7) {
                  index = 0;
                }
              }
              if (valueEnd === 0) {
                indexRemove.push(Number(0));
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
        this.__showToaster('Todos os dias foram preenchidos', 'danger');
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

  /**
   * verifyHour
   * 
   * @author Mateus Macedo
   * @param i Posição do array
   * @param type Valor 1 ou 0, 0 se refere ao START e 1 se refere ao END
   * @param hour Valor da hora
   * @return {void}
   */

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


  /**
   * onSubmit
   * 
   * Função do submit do formulário
   * 
   * @author Mateus Macedo
   * @return {void}
   */

  async onSubmit() {

    this.submitted = true;
    this.myform.forEach(item => {
      if (!item.valid) {
        this.__showToaster('Por favor preencha todos os campos obrigatórios.', 'danger');
        this.submitted = false
      }
    });

    if (this.submitted) {
      this.firestore.doc(`login/${this.keyDoc}`).update({
        // openingHours: this.formattedDocumentFirebase()
        openingHours: this.myform.map(item => item.value)
      }).then(item => {
        this.__showToaster('Cadastro foi realizado com sucesso!', 'success');
      }).catch(err => {
        console.log(err);
      });
    }

  }


  /**
   * __checkDaysNotAvailiable
   * 
   * Função que retorna um array com todos os dias não disponiveis
   * 
   * @param dayStart Dia de início
   * @param dayEnd Dia final
   * @param index Posição do array
   * @return {Array<number>}
   */

  private __checkDaysNotAvailiable(dayStart: number, dayEnd: any, index: number): Array<number> {
    let arrayDays: Array<number> = [];

    if (dayEnd || this.myform[index].value.dayEnd === "0") {

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
            if (dayEnd === 0) {
              arrayDays.push(Number(0));
            }
          }
        }

        if (arrayDays.length != 7) {
          arrayDays.push(i);
        }
      }
    } else {
      //Nao preencheu o dateEnd
      arrayDays.push(dayStart);
      if (this.myform[index].value.dayEnd === "0") {
        arrayDays.push(dayEnd);
      }
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

  /**
   * removeItem
   * 
   * Função para remover um item no form
   * 
   * @param index Posição no array
   */
  public removeItem(index: number) {
    this.arrayDaysOptions.splice(index, 1);
    this.myform.splice(index, 1);
  }

  /**
   * renewOptions
   * 
   * Função que limpa as opções dos dias que estão abaixo com os dias disponíveis
   * 
   * @param index Posição no array
   * @return {void}
   */

  public renewOptions(index: number) {

    const newDayStart: number = Number(this.myform[index].value.dayStart);
    const newDayEnd: number = Number(this.myform[index].value.dayEnd);

    const arrayDays = this.__checkDaysNotAvailiable(newDayStart, newDayEnd, index);

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
