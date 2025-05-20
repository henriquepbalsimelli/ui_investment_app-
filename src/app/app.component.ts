import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient }  from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment as env } from '../environments/environment';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-app';
  contas: any[] = [];

  constructor(private http: HttpClient) {}

  clearLocalStorage() {
    localStorage.removeItem('belvo_access_token');
    localStorage.removeItem('belvo_link');
    localStorage.removeItem('belvo_institution');
  }

  ngOnInit(): void {
    this.buscarContas();
  }

  buscarContas() {
    this.http.get<any[]>(`${env.apiUrl}/accounts/list`).subscribe({
      next: (dados) => this.contas = dados,
      error: (err) => console.error('Erro ao buscar contas:', err)
    });
  }

  callbackSuccess(link: string, institution: string) {
    localStorage.setItem('belvo_link', link);
    localStorage.setItem('belvo_institution', institution);
    console.log('Link criado:', link);
    console.log('Instituição:', institution);
    const url = `${env.apiUrl}/users/link`;
    console.log('Enviando POST para:', url, 'com payload:', { "link": link, "institution_name": institution });
    this.http.post(url, { "link": link, "institution_name": institution })
      .subscribe({
        next: (response) => {
          console.log('Link enviado com sucesso:', response);
          this.buscarContas();
        },
        error: (error) => {
          console.error('Erro ao enviar o link:', error);
          if (error.status === 0) {
            console.error('Falha de rede ou CORS. Verifique se o backend está rodando e se CORS está habilitado.');
          }
        }
      });
    this.clearLocalStorage();
  }

  onExitCallbackFunction(data: any) {
    console.log('Dados de saída:', data);
    this.clearLocalStorage();
  }

  initializeBelvoWidget() {
    const storedToken = localStorage.getItem('belvo_access_token');
    if (storedToken) {
      this.buildBelvoWidget(storedToken);
    } else {
      fetch(`${env.apiUrl}/authentication/belvo-token`)
        .then(response => response.json())
        .then(data => {
          const access_token = data.access;
          console.log(access_token)
          localStorage.setItem('belvo_access_token', access_token);
          this.buildBelvoWidget(access_token);
        })
        .catch(error => {
          console.error('Erro ao obter o access token:', error);
          this.clearLocalStorage();
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
