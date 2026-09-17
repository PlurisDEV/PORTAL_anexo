import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Autenticacao } from '../../autenticacao.service'
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() public exibirPainel: EventEmitter<string> = new EventEmitter<string>()

  public formLogin: FormGroup = new FormGroup({
    'usuario': new FormControl(null, [Validators.required]),
    'senha': new FormControl(null, [Validators.required])
  })
  hide = true;
  
  public empresa: any;
  public chamado: any;
  public maniSeq: any;

  constructor(
    private auth: Autenticacao, 
    private route: ActivatedRoute){
     
      this.route.params.subscribe(params => this.empresa = params['empresa']);
      this.route.params.subscribe(params => this.chamado = params['chamado']);
      this.route.params.subscribe(params => this.maniSeq = params['maniSeq']);
      
    }

  ngOnInit(): void {
  }
  
  public entrar(): void{
    console.log(this.formLogin)
    
    this.auth.autenticar(this.formLogin.value.usuario, this.formLogin.value.senha, this.empresa, this.chamado, this.maniSeq);
  }  
}
