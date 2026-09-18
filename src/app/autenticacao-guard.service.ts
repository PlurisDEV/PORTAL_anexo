
import { Injectable } from '@angular/core'
import { Autenticacao } from './autenticacao.service'

@Injectable()
export class AutenticacaoGuard {

    constructor(private auth: Autenticacao){}

    canActivate(): boolean{
        return this.auth.autenticado()
    }

}