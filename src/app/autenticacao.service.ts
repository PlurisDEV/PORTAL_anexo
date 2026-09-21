import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Usuario } from './usuario.model'
import * as firebase from 'firebase'
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs'
import { HttpClient, HttpParams } from '@angular/common/http'
import { NotificationService } from '../app/notification.service';

@Injectable()
export class Autenticacao {
    
    tokenURL: string = environment.urlBackend + environment.obterTokenURL
    loginURL: string = environment.urlBackend + environment.login
  
    clientID: string = environment.clientId
    clientSecret: string = environment.clientSecret
    errors: string = ""

    public token_id: string
    
    constructor(
        private router: Router,
        private http: HttpClient,
        protected notification: NotificationService
    ){ }

    public autenticar(usuario: string, senha: string, empresa:string, chamado:string, maniSeq:string): void{

        this.storageLogin(usuario, senha, empresa).subscribe(
            response => {

                localStorage.removeItem('access_token');

                localStorage.setItem('idFuncionario',   response.idFuncCdFuncionario);
                localStorage.setItem('nomeFuncionario', response.funcNmFuncionario);
                localStorage.setItem('tipoPermissao', response.funcDsPermissao);
                localStorage.setItem('empresa', empresa);
                localStorage.setItem('chamado', chamado);
                localStorage.setItem('maniSeq', maniSeq);

                if(response.idFuncCdFuncionario == 0){
                    this.errors = 'Usuário e/ou Senha incorreto(s)'
                    this.notification.showError(this.errors);
                }else{
                    this.router.navigate(['/home/allFiles']);
                }
            },errorResponse => {
                this.errors = 'Usuário e/ou Senha incorreto(s)'
                this.notification.showError(this.errors);
            }
        )
    }

    public storageLogin( userName: string, password: string, empresa:string ) :  Observable<any>{

        let json = { "funcDsLoginname" : userName,
                   "funcDsPassword" : password,
                   "idEmbaCdEmpresabanco" : empresa
                    }

        const headers = {
            'Content-Type' : 'application/json'
        }

        return this.http.post(this.loginURL, json, { headers : headers});

    }   


    public autenticado(): boolean{
        if(this.token_id === undefined && localStorage.getItem('access_token') !== null){
            this.token_id = localStorage.getItem('access_token')
        }else if (this.token_id === undefined && localStorage.getItem('access_token') == null){
            this.router.navigate(['/'])
        }
        return this.token_id !== undefined
    }

    public sair(): void {
        firebase.auth().signOut().then(()=>{
            localStorage.removeItem('access_token')
            this.token_id = undefined

            let empresa = localStorage.getItem('empresa');
            let chamado = localStorage.getItem('chamado');
            let maniSeq = localStorage.getItem('maniSeq');

            localStorage.setItem('empresa', "");
            localStorage.setItem('chamado', "");
            localStorage.setItem('maniSeq', "");
            localStorage.setItem('idFuncionario', "0");

            this.router.navigate(["/"+empresa+"/"+chamado+"/"+maniSeq])
        })
    }
}