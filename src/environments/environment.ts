// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  
  production: false,

  //ACESSOS DA APLICAÇÃO CADASTRADOS NO BACKEND (SPRING BOOT)
  // urlBackend: 'http://localhost:8280', // TESTES LOCAIS
  urlBackend: 'https://portalanexobackend.ranbaxy.plurismidia.com.br', // TESTES LOCAIS
  clientId: 'portal-anexo-pluris',
  clientSecret: '', 
  
  //CHAMADAS (SEVIÇOS BACKEND SPRING BOOT)
  //POST s
    obterTokenURL:  '/oauth/token', //AUTENTICAÇÃO (OATH2 + JWT)
    cadastrarUsuario: '/portalpluris/criarusuario', //CADASTRA FUNCIONARIOS
    login: '/portalpluris/login', 
    
  //GET s
    getAnexo: '/portalpluris/getanexo',
    getLogo: '/portalpluris/getlogoempresa',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
