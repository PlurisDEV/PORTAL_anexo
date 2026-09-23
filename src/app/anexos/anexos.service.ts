import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http'

@Injectable()

export class AnexosService {

    private getAnexo: string = environment.urlBackend + environment.getAnexo;
    private getAnexoById: string = environment.urlBackend + environment.getAnexoById;

    constructor(
        private http: HttpClient
    ){ }

    private getHeaders() {
        const tokenString = localStorage.getItem('access_token');
        // const token = JSON.parse(tokenString);

        return {
            // 'Authorization' : 'Bearer ' + token.access_token,
            'Content-Type' : 'application/json'
        };
    }

    public obterAnexos(empresa:string, chamado:string, maniSeq:string):Promise<any> {
        const headers = this.getHeaders();
        return this.http.get(this.getAnexo+"/"+chamado+"/"+maniSeq+"/"+empresa, { headers : headers})
        .toPromise().then();
    }

    public obterAnexoById(idMaarCdManifArquivo: string): Promise<any> {
        const headers = this.getHeaders();
        return this.http.get(this.getAnexoById+"/"+idMaarCdManifArquivo, { headers : headers})
            .toPromise().then();
    }
}
