import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { HttpClient} from '@angular/common/http'

@Injectable()

export class AnexosService {

    private getAnexo: string = environment.urlBackend + environment.getAnexo;

    constructor(
        private http: HttpClient
    ){ }

    public obterAnexos(empresa:string, chamado:string, maniSeq:string):Promise<any> {

        const tokenString = localStorage.getItem('access_token');
        const token = JSON.parse(tokenString);

        const headers = {
            'Authorization' : 'Bearer ' + token.access_token,
            'Content-Type' : 'application/json'
        }

        return this.http.get(this.getAnexo+"/"+chamado+"/"+maniSeq+"/"+empresa, { headers : headers})
        .toPromise().then();
    }
}
