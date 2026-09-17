import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AnexosModel } from './anexos.model'

import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router'
import { AnexosService } from './anexos.service';

@Component({
  selector: 'app-anexos',
  templateUrl: './anexos.component.html',
  styleUrls: ['./anexos.component.css'],
  providers: [AnexosService]
})
export class AnexosComponent implements OnInit {
  
  public idFuncSessao:string = localStorage.getItem('idFuncionario'); 
  public chamadoSessao:string = localStorage.getItem('chamado'); 
  public maniSeqSessao:string = localStorage.getItem('maniSeq'); 
  public empresaSessao:string = localStorage.getItem('empresa');

  public lstAnexos: AnexosModel[] = []
  public zipFile = new JSZip();
  
  constructor(
    private router: Router, 
    private sanitizer: DomSanitizer,
    private anexosService: AnexosService) {  }

  dtOptions: DataTables.Settings = {}

  public mostrarTabela : boolean = false

  ngOnInit() {

    if(this.idFuncSessao == undefined || this.idFuncSessao == '0'){
      this.router.navigate(['/0/0/0']);
    }

    this.lstAnexos = [];

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu : [5, 10, 20],
      autoWidth: false,
      responsive: true,
      scrollY:"260px",
      scrollX:true,
      columnDefs: [
          { className: "tableFont", targets: "_all" },
      ],

      language: {
        emptyTable: "Nenhum registro encontrado",
        info: "Mostrando de _START_ até _END_ de _TOTAL_ registros",
        infoEmpty: "Mostrando 0 até 0 de 0 registros",
        infoFiltered: "(Filtrados de _MAX_ registros)",
        loadingRecords: "Carregando...",
        processing: "Processando...",
        zeroRecords: "Nenhum registro encontrado",
        search: "Pesquisar",
        paginate: {
            next: "Próximo",
            previous: "Anterior",
            first: "Primeiro",
            last: "Último"
        },
        aria: {
            sortAscending: ": Ordenar colunas de forma ascendente",
            sortDescending: ": Ordenar colunas de forma descendente"
        },
        thousands: ".",
        lengthMenu: "Exibindo _MENU_ registros por página",
      } 
    };

    this.preencheLista();
  }

  public preencheLista():void{

    this.anexosService.obterAnexos(this.empresaSessao, this.chamadoSessao, this.maniSeqSessao)
      .then((retorno:AnexosModel[] = []) =>{
        this.lstAnexos = retorno;
        
        for (let index = 0; index < this.lstAnexos.length; index++) {
          
          this.mostrarTabela = true;
          const element = this.lstAnexos[index];
          
          const blob = this.b64toBlobs(element.anexoBinario);
          let fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    
          element.urlDownload = fileUrl;
          this.zipFile.file(element.nomeAnexo, blob);
        }
      } 
    );

  }

  public downloadAll():void {
    
    this.zipFile.generateAsync({ type: "blob" })
    .then(function (content) {
      FileSaver.saveAs(content, localStorage.getItem('chamado')+"-"+localStorage.getItem('maniSeq')+".zip");
    });

  }

  public b64toBlobs = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
 
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
 
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
 
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
 
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  /*public preencheListaTeste():void{

    let i:number = 0;
    while(i < 10){
      
      let strBase64:string = "base64"

      const blob = this.b64toBlobs(strBase64)
      let fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));

      let anexos : AnexosModel = new AnexosModel(
        "nome"+i+".png",
        "05/01/2020 16:56:23",
        strBase64,
        fileUrl
      );

      this.lstAnexos.push(anexos);
      this.zipFile.file("nome"+i+".png", blob);

      i++;
    }
  }
  */

}
