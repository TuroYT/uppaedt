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

export interface UnCours {
    idCours : number,
    nomCours : string,
    dateDeb : Date,
    dateFin : Date,
    prof : string,
    lieu : string,
    idFormation : number,
    nomGroupe : string
}

export interface Event {
    title: String;
    start: String;
    end: String;
    description: String;
    id: String;
    color: String;
    extendedProps: {
      prof: String;
      cours: String;
      location: String;
      isLastCours: boolean;
      start: String;
      end: String;
    };
  }