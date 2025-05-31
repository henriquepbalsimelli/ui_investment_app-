import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DetalhesService } from '../../services/details.service';

import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';



@Component({
  selector: 'app-dashboard',
  templateUrl: './detalhes.component.html',
  styles: [
    `.flex-container { display: flex; flex-direction: row; justify-content: center; align-items: center; }`,
    `.flex { display: flex; flex-direction: column; width: 75%; }`,
    `.min-h-screen { min-height: 100vh; }`,
    `.p-6 { padding: 1.5rem; background: linear-gradient(135deg, #2d185a 0%, #1a1a2e 100%); min-height: 100vh; color: #fff; }`,
    `.mb-4 { margin-bottom: 1rem; }`,
    `.text-white { color: #fff; }`,
    `.text-2xl { font-size: 1.5rem; font-weight: bold; color: #c7d2fe; }`,
    `.text-lg { font-size: 1.125rem; font-weight: 600; color: #a78bfa; }`,
    `.text-sm { font-size: 0.875rem; color: #c7d2fe; }`,
    `.text-muted-foreground { color: #a1a1aa; }`,
    `.opacity-70 { opacity: 0.7; }`,
    `.mt-1 { margin-top: 0.25rem; }`,
    `.mt-2 { margin-top: 0.5rem; }`,
    `.bg-white-opacity { background-color: rgba(255, 255, 255, 0.08); }`,
    `.border-white-opacity { border: 1px solid #7c3aed; }`,
    `mat-card { background: #23213a !important; color: #fff !important; border: 1px solid #7c3aed; }`,
    `mat-tab-group { background: transparent !important; color: #fff !important; }`,
    `mat-expansion-panel { background: #2d185a !important; color: #fff !important; border: 1px solid #7c3aed; }`,
    `mat-expansion-panel-header { background: #1a1a2e !important; color: #a78bfa !important; }`,
    `mat-chip { background: #7c3aed !important; color: #fff !important; }`
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatExpansionModule,
    MatChipsModule
  ]
})
export class DetalhesComponent {
  detalhes: any[];
  constructor(private router: Router, private detalhesService: DetalhesService) {
    this.detalhes = this.detalhesService.getDetalhes() || [];
  }
  voltar() {
    this.router.navigate(['/']);
  }

  getActiveAccounts(detalhe: any) {
    return (detalhe.accounts || []).filter((acc: any) => acc.category !== 'CREDIT_CARD');
  }
  getPassiveAccounts(detalhe: any) {
    return (detalhe.accounts || []).filter((acc: any) => acc.category === 'CREDIT_CARD');
  }
}

