import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Usuario } from '../../usuario.model'
import { ToastrService } from 'ngx-toastr';
import { Autenticacao } from 'src/app/autenticacao.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from "rxjs/operators";
import { TipoUsuarioModel } from 'src/app/tipo-usuario.model';
import { UsuarioService } from 'src/app/usuario.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  public idTipoFuncionario: number = 0
  public descricaoTipoFuncionario: string = ''
  public lstTipoFuncionario : TipoUsuarioModel[] = []
  

  cadastrarFuncionarioURL: string = environment.urlBackend + environment.cadastrarUsuario
  
  @Output() public exibirPainel: EventEmitter<string> = new EventEmitter<string>()

  public formCadastro: FormGroup = new FormGroup({
    'nome': new FormControl(null, [Validators.required]),
    'user': new FormControl(null, [Validators.required]),
    'senha': new FormControl(null, [Validators.required]),
    'email': new FormControl(null, [Validators.required]),
    'tipoPermissao': new FormControl(null, [Validators.required])    
  })
  hide = true;
  hideConf = true;

  constructor(private toastr: ToastrService, 
              private userService: UsuarioService,
              private http: HttpClient) { }

  ngOnInit(): void {
    
  }

  public exibirPainelLogin(){
    this.exibirPainel.emit('login');
  }

  /*public cadastrar(){
    if(this.formCadastro.value.senha != this.formCadastro.value.confirmarSenha){
      console.log(this.formCadastro.value.senha)
      console.log(this.formCadastro.value.confirmarSenha)
      this.toastr.error('A confirmação de senha não confere com a senha digitada', 'Confirme sua senha!')
    }else{
      let usuario: Usuario = new Usuario(
        this.formCadastro.value.email,
        this.formCadastro.value.nome,
        this.formCadastro.value.senha
      )
      this.auth.cadastrarUsuario(usuario)
        .then((resposta:any)=>{
          this.toastr.success('Usuário cadastrado com sucesso','Cadastrar usuário')
          this.exibirPainelLogin()
        })
        .catch((error: Error)=>{
          this.toastr.error('Usuário já cadastrado','Cadastrar usuário')
      })
      
      // if(cadastroUsuario){
      //   this.toastr.success('Usuário cadastrado com sucesso','Cadastrar usuário')
      // }else{
      //   this.toastr.error('Usuário não cadastrado','Cadastrar usuário')
      // }
    }

  }*/

  public cadastrar(){

    let usuario: Usuario = new Usuario(
      this.formCadastro.value.nome,
      this.formCadastro.value.user,
      this.formCadastro.value.senha,
      this.formCadastro.value.email,
      this.formCadastro.value.tipoPermissao
    )
   
    this.userService.cadastrarUsuario(usuario)
        .subscribe( response => {
                      this.toastr.success('Usuário cadastrado com sucesso','Cadastrar usuário')
                      this.exibirPainelLogin()
                    }, errorresponse => {
                        this.toastr.error('Usuário já cadastrado','Cadastrar usuário')
                    }) 
        
  }

}
