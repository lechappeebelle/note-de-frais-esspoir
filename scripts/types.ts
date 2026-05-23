
export interface Dépense {
  dateDépense: Date,
  nomFournisseur: string,
  natureDépense: string,
  motifDépense: string,
  montantHT: number,
  montantTTC: number,
  commentaires: string,
  justificatif: FileList,
}
