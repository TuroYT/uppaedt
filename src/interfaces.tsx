export interface UnEvent {
    idCours : number,
    nomGroupe : string,
    nomCours : string,
    dateDeb : Date,
    dateFin : Date,
    prof : string,
    lieu : string,
    idFormation : number
}

export interface UneFormation {
    idFormation : number,
    nom: string,
    description : string,
    estActif : boolean
}

export interface UnGroupe {
    nomGroupe : string,
    idFormation : number
}