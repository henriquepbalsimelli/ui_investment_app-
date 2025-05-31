import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DetalhesService {
  private _detalhes: any;
  setDetalhes(detalhes: any) {
    console.log('DetalhesService: setDetalhes', detalhes);
    this._detalhes = detalhes;
  }
  getDetalhes() {
    return this._detalhes;
  }
}