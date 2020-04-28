import { Component, ViewChild, ElementRef } from '@angular/core';

import pdfMake from 'pdfmake';
import html2canvas from 'html2canvas';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.page.html',
  styleUrls: ['./pdf.page.scss'],
})
export class PdfPage {
  name = 'Angular';

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
      logging: true,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      allowTaint : true,
    };

    console.log('DIV->', div);

    //html2canvas(document.getElementById('invoice-panel'), { letterRendering: 1, allowTaint : true, onrendered : function (canvas) { } });

    html2canvas(div, options).then(async (canvas) => {

      console.log(canvas.offsetLeft);
      console.log(canvas.offsetTop);
      console.log(canvas);
      var img = await canvas.toDataURL();

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
    }).then((doc) => {

    });
  }

}
