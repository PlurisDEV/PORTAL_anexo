import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http'

@Injectable()

export class HomeServices {

    private getLogo: string = environment.urlBackend + environment.getLogo;

    constructor(
        private http: HttpClient
    ){ }

    public obterLogo(empresa:string):Promise<any> {

        const tokenString = localStorage.getItem('access_token');
        const token = JSON.parse(tokenString);

        const headers = {
            'Authorization' : 'Bearer ' + token.access_token,
            'Content-Type' : 'application/json'
        }

        return this.http.get(this.getLogo+"/"+empresa, { headers : headers})
        .toPromise().then();
    }
}
