import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

function loadBelvoScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.belvo.io/belvo-widget-1-stable.js';
    script.onload = () => {
      console.log('Script do Belvo carregado com sucesso');
      resolve();
    };
    script.onerror = () => {
      console.error('Erro ao carregar o script do Belvo');
      reject();
    };
    document.head.appendChild(script);
  });
}

// loadBelvoScript()
//   .then(() => {
//     // Inicialize o Angular após o script ser carregado
//     import('./bootstrap').then(({ bootstrap }) => bootstrap());
//   })
//   .catch(() => {
//     console.error('Falha ao carregar o script do Belvo. O Angular será inicializado mesmo assim.');
//     import('./bootstrap').then(({ bootstrap }) => bootstrap());
//   });
loadBelvoScript()
.then(() => {
  console.log('Script do Belvo carregado com sucesso');
})
.catch(() => {  
  console.error('Erro ao carregar o script do Belvo');
});
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
