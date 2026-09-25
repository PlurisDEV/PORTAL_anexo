import { Component, OnInit } from '@angular/core';
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
  
  private pad(num: number, size: number): string {
    return String(num).padStart(size, '0');
  }

  private buildTimestamp(date: Date = new Date()): string {
    const yyyy = date.getFullYear();
    const MM = this.pad(date.getMonth() + 1, 2);
    const dd = this.pad(date.getDate(), 2);
    const HH = this.pad(date.getHours(), 2);
    const mm = this.pad(date.getMinutes(), 2);
    const ss = this.pad(date.getSeconds(), 2);
    const SSS = this.pad(date.getMilliseconds(), 3);

    return `${yyyy}${MM}${dd}${HH}${mm}${ss}${SSS}`;
  }

  private appendTimestampToFilename(filename: string, timestamp: string = this.buildTimestamp()): string {
    if(!filename){
      return `arquivo_${timestamp}`;
    }

    const cleanFilename = String(filename).replace(/[/\\]+/g, '_');
    const lastDot = cleanFilename.lastIndexOf('.');

    if(lastDot <= 0 || lastDot === cleanFilename.length - 1){
      return `${cleanFilename}_${timestamp}`;
    }

    const base = cleanFilename.substring(0, lastDot);
    const ext = cleanFilename.substring(lastDot); // includes '.'

    return `${base}_${timestamp}${ext}`;
  }

  public idFuncSessao:string = localStorage.getItem('idFuncionario'); 
  public chamadoSessao:string = localStorage.getItem('chamado'); 
  public maniSeqSessao:string = localStorage.getItem('maniSeq'); 
  public empresaSessao:string = localStorage.getItem('empresa');

  public lstAnexos: AnexosModel[] = []
  public isDownloading: boolean = false;
  public downloadTotal: number = 0;
  public downloadCurrent: number = 0;
  public selectAllChecked: boolean = false;
  public selectedIds: Set<string> = new Set<string>();
  
  constructor(
    private router: Router, 
    private anexosService: AnexosService) {  }

  dtOptions: DataTables.Settings = {}

  public mostrarTabela : boolean = false

  ngOnInit() {

    if(this.idFuncSessao == undefined || this.idFuncSessao == '0'){
      this.router.navigate(['/0/0/0']);
    }

    this.lstAnexos = [];

    this.dtOptions = {
      paging: false,
      info: false,
      autoWidth: false,
      responsive: true,
      scrollY:"calc(100vh - 280px)",
      scrollCollapse: true,
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
        this.mostrarTabela = true;
        this.selectedIds = new Set<string>();
        this.selectAllChecked = false;
      } 
    );

  }

  public toggleSelectAll(checked: boolean): void {
    this.selectAllChecked = checked;
    this.selectedIds = new Set<string>();

    if(checked){
      for (let index = 0; index < this.lstAnexos.length; index++) {
        const id = this.lstAnexos[index]?.idMaarCdManifArquivo;
        if(id != null){
          this.selectedIds.add(String(id));
        }
      }
    }
  }

  public toggleSelectOne(anexo: AnexosModel, checked: boolean): void {
    const id = anexo?.idMaarCdManifArquivo;
    if(id == null){
      return;
    }

    const idStr = String(id);

    if(checked){
      this.selectedIds.add(idStr);
    } else {
      this.selectedIds.delete(idStr);
    }

    this.selectAllChecked = this.lstAnexos.length > 0 && this.lstAnexos.every(a => a?.idMaarCdManifArquivo != null && this.selectedIds.has(String(a.idMaarCdManifArquivo)));
  }

  public get hasSelection(): boolean {
    return this.selectedIds.size > 0;
  }

  public idToString(id: any): string {
    return String(id);
  }

  public async downloadSelected(): Promise<void> {

    this.isDownloading = true;
    this.downloadTotal = this.selectedIds.size;
    this.downloadCurrent = 0;

    const zipFile = new JSZip();

    try {
      for (let index = 0; index < this.lstAnexos.length; index++) {
        const anexo = this.lstAnexos[index];
        const id = anexo?.idMaarCdManifArquivo;

        if(id == null){
          continue;
        }

        if(!this.selectedIds.has(String(id))){
          continue;
        }

        const retorno = await this.anexosService.obterAnexoById(String(id));
        const item = Array.isArray(retorno) ? retorno[0] : retorno;
        const b64 = item?.anexoBinario;

        const blob = this.b64toBlobs(b64);
        const filename = this.appendTimestampToFilename(anexo.nomeAnexo);
        zipFile.file(filename, blob);

        this.downloadCurrent = this.downloadCurrent + 1;
      }

      const content = await zipFile.generateAsync({ type: "blob" });
      FileSaver.saveAs(content, "anexos.zip");
    } finally {
      this.isDownloading = false;
    }
  }

  public async downloadAnexo(anexo: AnexosModel): Promise<void> {

    const retorno = await this.anexosService.obterAnexoById(anexo.idMaarCdManifArquivo);
    const item = Array.isArray(retorno) ? retorno[0] : retorno;
    const b64 = item?.anexoBinario;

    const blob = this.b64toBlobs(b64);
    const filename = this.appendTimestampToFilename(anexo.nomeAnexo);
    FileSaver.saveAs(blob, filename);
  }

  public b64toBlobs = (b64Data, contentType='', sliceSize=512) => {
    if(!b64Data){
      return new Blob([]);
    }

    const normalized = typeof b64Data === 'string' && b64Data.includes('base64,')
      ? b64Data.split('base64,')[1]
      : b64Data;

    const byteCharacters = atob(normalized);
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
