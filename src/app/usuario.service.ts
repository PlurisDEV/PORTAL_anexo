import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Usuario } from './usuario.model'
import * as firebase from 'firebase'
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs'
import { HttpClient, HttpParams } from '@angular/common/http'


@Injectable()
export class UsuarioService {
    
    cadastrarFuncionarioURL: string = environment.urlBackend + environment.cadastrarUsuario
    
    clientID: string = environment.clientId
    clientSecret: string = environment.clientSecret
    errors: String[]

    
    constructor(
        private router: Router,
        private http: HttpClient
    ){ }


    
    public cadastrarUsuario(usuario: Usuario):Observable<any>{
        
       /* return firebase.auth().createUserWithEmailAndPassword(usuario.usuario, usuario.senha)
        .then((resposta: any)=>{
            //remover a senha do atributo senha do objeto usuario
            delete usuario.senha
            //registrando dados complementares do usuário no path email em base64
            firebase.database().ref(`usuario_detalhe/${btoa(usuario.usuario)}`)
                .set(usuario)
        })*/

                
        const tokenString = localStorage.getItem('access_token');
        const token = JSON.parse(tokenString);

        let json = { "nome" : usuario.nome,
                    "user" : usuario.email,
                    "password" : usuario.senha,
                    "email" : usuario.email,
                    "tipoPermissao" : usuario.tipoPermissao,
                }


        const headers = {
            'Authorization' : 'Bearer ' + token.access_token,
            'Content-Type': 'application/json'
        };

        /*
        console.log(JSON.stringify(json));

        this.http.post(this.cadastrarFuncionarioURL, json, { headers : headers}).subscribe((ret : Response ) => {
            console.log(ret)
        });*/
            
        // return this.http.get<any>(this.cadastrarFuncionarioURL, { headers : headers});
        return this.http.post(this.cadastrarFuncionarioURL, json, { headers : headers});

    }  
}