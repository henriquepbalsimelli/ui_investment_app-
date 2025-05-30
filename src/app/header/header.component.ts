import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet, Router } from '@angular/router';
import { environment as env } from '../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    imports: [CommonModule],
})
export class HeaderComponent {
    showLogin = true;
    showRegister = false;
    loginError = '';
    registerError = '';
    username = '';
    password = '';
    registerUsername = '';
    registerPassword = '';
    contas: any[] = [];

    constructor(private http: HttpClient, private router: Router) { }
    
    @Input() isAuthenticated = false;
    @Input() conectarConta!: () => void;
    @Input() logout!: () => void;

    logoutUser() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('external_id');
        this.isAuthenticated = false;
        this.showLogin = true;
        if (this.logout) {
            this.logout();
        }
    }

    clearLocalStorage() {
        localStorage.removeItem('belvo_access_token');
        localStorage.removeItem('belvo_link');
        localStorage.removeItem('belvo_institution');
    }
    
    login() {
        this.loginError = '';
        this.http.post<any>(`${env.apiUrl}/authentication/login`, {
            email: this.username,
            password: this.password
        }).subscribe({
            next: (res) => {
                localStorage.setItem('access_token', res.access_token);
                localStorage.setItem('external_id', res.guid);
                this.checkAuthentication();
            },
            error: (err) => {
                this.loginError = 'Usuário ou senha inválidos';
            }
        });
    }

    register() {
        this.registerError = '';
        this.http.post<any>(`${env.apiUrl}/users/create`, {
            email: this.registerUsername,
            password: this.registerPassword
        }).subscribe({
            next: (res) => {
                this.showRegister = false;
                this.showLogin = true;
            },
            error: (err) => {
                this.registerError = 'Erro ao registrar usuário';
            }
        });
    }

    
    checkAuthentication() {
        const token = localStorage.getItem('access_token');
        if (!token) {
            this.isAuthenticated = false;
            this.showLogin = true;
            return;
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);
            this.isAuthenticated = payload.exp && payload.exp > now;
            this.showLogin = !this.isAuthenticated;
            if (!this.isAuthenticated) {
                localStorage.removeItem('access_token');
            }
        } catch (e) {
            this.isAuthenticated = false;
            this.showLogin = true;
            localStorage.removeItem('access_token');
        }
    }
    onExitCallbackFunction(data: any) {
        this.clearLocalStorage();
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
    const url = `${env.apiUrl}/users/link`;
    this.http.post(url, { "link": link, "institution_name": institution })
      .subscribe({
        next: (response) => {
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
    private buildBelvoWidget(access_token: string) {
    const belvoSDK = (window as any).belvoSDK;
    if (belvoSDK) {
      try {
        const widget = belvoSDK.createWidget(access_token, {
          fetch_resources: ["ACCOUNTS", "TRANSACTIONS", "OWNERS"],
          callback: (link: string, institution: string) => this.callbackSuccess(link, institution),
          onExit: (data: any) => this.onExitCallbackFunction(data),
          external_id: "external_id",
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
    initializeBelvoWidget() {
    this.checkAuthentication();
    if (!this.isAuthenticated) return;
    const storedToken = localStorage.getItem('belvo_access_token');
    if (storedToken) {
      this.buildBelvoWidget(storedToken);
    } else {
      fetch(`${env.apiUrl}/authentication/belvo-token`)
        .then(response => response.json())
        .then(data => {
          const access_token = data.access;
          localStorage.setItem('belvo_access_token', access_token);
          this.buildBelvoWidget(access_token);
        })
        .catch(error => {
          console.error('Erro ao obter o access token:', error);
          this.clearLocalStorage();
        });
    }
  }
}