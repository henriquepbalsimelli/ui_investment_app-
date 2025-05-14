import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-app';

  clearLocalStorage() {
    localStorage.removeItem('belvo_access_token');
    localStorage.removeItem('belvo_link');
    localStorage.removeItem('belvo_institution');
  }

  ngOnInit(): void {
    this.initializeBelvoWidget();
  }

  callbackSuccess(link: string, institution: string) {
    localStorage.setItem('belvo_link', link);
    localStorage.setItem('belvo_institution', institution);
    console.log('Link criado:', link);
    console.log('Instituição:', institution);
  }

  onExitCallbackFunction(data: any) {
    console.log('Dados de saída:', data);
  }

  initializeBelvoWidget() {
    const storedToken = localStorage.getItem('belvo_access_token');
    if (storedToken) {
      this.buildBelvoWidget(storedToken);
    } else {
      fetch('http://localhost:8000/authentication/belvo-token')
        .then(response => response.json())
        .then(data => {
          const access_token = data.access;
          console.log(access_token)
          localStorage.setItem('belvo_access_token', access_token);
          this.buildBelvoWidget(access_token);
        })
        .catch(error => {
          console.error('Erro ao obter o access token:', error);
        });
    }
  }

  private buildBelvoWidget(access_token: string) {
  const belvoSDK = (window as any).belvoSDK;
  if (belvoSDK) {
    try {
      const widget = belvoSDK.createWidget(access_token, {
        fetch_resources: ["ACCOUNTS", "TRANSACTIONS", "OWNERS"],
        callback: (link: string, institution: string) => this.callbackSuccess(link, institution),
        onExit: (data: any) => this.onExitCallbackFunction(data),
      });
      widget.build();
    } catch (error) {
      this.clearLocalStorage();
      console.error('Erro ao criar ou construir o widget:', error);
    }
  } else {
    this.clearLocalStorage();
    console.error('belvoSDK não está definido');
  }
}
}
