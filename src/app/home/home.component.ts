import { Component, OnInit } from '@angular/core';
import { Autenticacao } from '../autenticacao.service'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { HomeServices } from './home.services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [HomeServices]
})
export class HomeComponent implements OnInit {
  
  public empresaSessao:string;
  public maniSeq:string;
  public chamado:string;
  public strBase64:string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  constructor(
    private auth: Autenticacao, 
    private breakpointObserver: BreakpointObserver,
    private homeServices: HomeServices) { }

  ngOnInit(): void {

    this.chamado = localStorage.getItem('chamado');
    this.maniSeq = localStorage.getItem('maniSeq');
    this.empresaSessao = localStorage.getItem('empresa');
    this.getLogoCliente();

  }

  public sair(): void {
    this.auth.sair()
  }

  public getLogoCliente(){

    this.homeServices.obterLogo(this.empresaSessao)
      .then((retorno:any) =>{
        this.strBase64 = retorno.logoBase64;
      }
    );
  }

}
