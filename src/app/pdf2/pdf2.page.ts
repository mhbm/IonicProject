import { Component } from '@angular/core';

import pdfMake from 'pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import domtoimage from 'dom-to-image';



@Component({
  selector: 'app-pdf',
  templateUrl: './pdf2.page.html',
  styleUrls: ['./pdf2.page.scss'],
})

// TODO - Verificar o texto que será enviado no whatsapp
// TODO - O numero do telefone precisa ser da loja
// TODO - Link deverá ser o da loja
// TODO - O nome do pdf trocar para o nome da loja

export class Pdf2Page {

  private __width: number = 503;
  private __height: number = 894;

  private __numberPhone = "5515981331861";

  private __textMessage = "Quero%20fazer%20um%20pedido";

  //TRANSPARENT BASE64 PNG
  private __imagePNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="

  generarPDF() {

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const div = document.getElementById('storeInformation');
    const options = {
      width: this.__width,
      height: this.__height,
    };

    console.log('DIV->', div);

    //html2canvas(document.getElementById('invoice-panel'), { letterRendering: 1, allowTaint : true, onrendered : function (canvas) { } });

    domtoimage.toPng(div, options).then(async (img) => {
      

      console.log('img->', img)
      let docDefinition = {
        //pageSize: { width: this.__width * this.__multiplyPDF , height: this.__height * this.__multiplyPDF },
        compress: false,
        pageSize: { width: this.__width, height: this.__height },
        content: [{
          image: img,
          width: this.__width,
          height: this.__height,
          margin: -40,
        },
        {
          image: this.__imagePNG,
          absolutePosition: { x: 59, y: 443 },
          height: 90,
          width: 380,
          opacity: 0,
          link : "http://helpper.com.br/",
        },
        {
          image: this.__imagePNG,
          absolutePosition: { x: 203, y: 842 },
          width: 102,
          height: 45,
          opacity: 0,
          link: `https://api.whatsapp.com/send?phone=${this.__numberPhone}&text=${this.__textMessage}&source=&data=&app_absent=`,
        }

        ],
      };
      pdfMake.createPdf(docDefinition).download('test.pdf');

      return pdfMake;
    }).catch(err => {
      console.log(err);
    });
  }

}
