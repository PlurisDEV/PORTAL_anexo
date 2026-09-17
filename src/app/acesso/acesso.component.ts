import { Component, OnInit } from '@angular/core';
import { BannerComponent } from './banner/banner.component'
import { LoginComponent } from './login/login.component'

@Component({
  selector: 'app-acesso',
  templateUrl: './acesso.component.html',
  styleUrls: ['./acesso.component.css']
})
export class AcessoComponent implements OnInit {
  cadastroComponent: boolean = false
  constructor() { }

  ngOnInit(): void {
  }

  public exibirPainel(event: string): void{
    if(event == 'cadastro'){
      this.cadastroComponent = true
    }else{
      this.cadastroComponent = false
    }
  }

}
