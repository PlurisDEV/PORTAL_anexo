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
    errors: String[] = [""]

    public token_id: string
    
    constructor(
        private router: Router,
        private http: HttpClient,
        protected notification: NotificationService
    ){ }

    tentarLogar( userName: string, password: string) :  Observable<any>{
       
        //PARAMETROS QUE VAI NO BODY DO POST
        const params = new HttpParams()
            .set('username',  userName)
            .set('password', password)
            .set('grant_type', 'password')

        //HEADER PARA O POST                                
        const headers = {
            'Authorization' : 'Basic ' + btoa(`${this.clientID}:${this.clientSecret}`),
            'Content-Type' : 'application/x-www-form-urlencoded'
        }
       
        //return this.http.post(this.tokenURL, params.toString, { headers : headers});
        return this.http.post(this.tokenURL, params, { headers : headers});
        
    }   

    public autenticar(usuario: string, senha: string, empresa:string, chamado:string, maniSeq:string): void{

        this.tentarLogar("DEV_PLURIS", "SuportePluris#2469").subscribe(
            response => { //CASO SUCESSO

                //ARMAZENA O TOKEN NO BROWSER 
                const access_token = JSON.stringify(response);
                localStorage.setItem('access_token', access_token);

                this.storageLogin(usuario, senha, empresa).subscribe(
                    response => {
                        
                        //ARMAZENA INFORMAÇÕES DO USUÁRIO NO BROWSER 
                        localStorage.setItem('idFuncionario',   response.idFuncCdFuncionario);
                        localStorage.setItem('nomeFuncionario', response.funcNmFuncionario);
                        localStorage.setItem('tipoPermissao', response.funcDsPermissao);
                        localStorage.setItem('empresa', empresa);
                        localStorage.setItem('chamado', chamado);
                        localStorage.setItem('maniSeq', maniSeq);

                        if(response.idFuncCdFuncionario == 0){
                            this.errors = ['Usuário e/ou Senha incorreto(s)']
                            this.notification.showError('',this.errors);

                        }else{
                        //ABRIR A TELA INICIAL
                        this.router.navigate(['/home/allFiles']);

                        }                        
                    },errorResponse => {
                        
                        this.errors = ['Usuário e/ou Senha incorreto(s)']
                        this.notification.showError('',this.errors);
                    }
                )

            }, 
            errorResponse => { //CASO ERRO
                this.errors = ['Usuário e/ou Senha incorreto(s)']
                this.notification.showError('',this.errors);
            }
        )
    }

    public storageLogin( userName: string, password: string, empresa:string ) :  Observable<any>{
        
        const tokenString = localStorage.getItem('access_token');
        const token = JSON.parse(tokenString);

        //PARAMETROS QUE VAI NO BODY DO POST
         let json = { "funcDsLoginname" : userName,
                    "funcDsPassword" : password,
                    "idEmbaCdEmpresabanco" : empresa
                     }
        //HEADER PARA O POST                                
        const headers = {
            'Authorization' : 'Bearer ' + token.access_token,
            'Content-Type' : 'application/json'
        }
       
        //return this.http.post(this.tokenURL, params.toString, { headers : headers});
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