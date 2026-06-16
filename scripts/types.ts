
export interface Dépense {
  dateDépense: Date,
  nomFournisseur: string,
  natureDépense: string,
  motifDépense: string,
  montantTVA: number,
  montantTTC: number,
  commentaires: string,
  justificatif?: FileList,
}
