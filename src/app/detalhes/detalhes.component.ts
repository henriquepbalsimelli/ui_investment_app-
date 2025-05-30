import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalhes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:2rem; color:#fff;">
      <h2>Detalhes das Contas Selecionadas</h2>
      <pre style="background:#23213a; color:#fff; padding:1rem; border-radius:8px;">
        {{ detalhes | json }}
      </pre>
      <button (click)="voltar()" style="margin-top:1rem; background:#7c3aed; color:#fff; border:none; border-radius:4px; padding:0.5rem 1.5rem;">Voltar</button>
    </div>
  `
})
export class DetalhesComponent {
  detalhes: any;
  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.detalhes = nav?.extras?.state?.['detalhes'] || {};
  }
  voltar() {
    this.router.navigate(['/']);
  }
}
