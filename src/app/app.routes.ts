import { Routes } from '@angular/router'
import { AcessoComponent } from './acesso/acesso.component'
import { HomeComponent } from './home/home.component'
import { PainelControleComponent } from './painel-controle/painel-controle.component'
import { AnexosComponent} from './anexos/anexos.component'

import { AutenticacaoGuard } from './autenticacao-guard.service'
import { CadastroComponent } from './acesso/cadastro/cadastro.component'



export const ROUTES: Routes = [
    { path: '', component: AcessoComponent },
    { path: ':empresa/:chamado/:maniSeq', component: AcessoComponent },
    { path: 'home', component: HomeComponent,
        children: [
            {path : 'allFiles' ,  component : AnexosComponent}
        ]
    },
    
]