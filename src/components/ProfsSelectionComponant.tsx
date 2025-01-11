import React, { useState, useEffect, useCallback } from "react";
import { doGet, doPost } from "../utils/Requests";
import {
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonSpinner,
  IonToggle,
} from "@ionic/react";
import { Preferences } from "@capacitor/preferences";

interface ProfsSelectionComponantProps {
    onProfsSelection: (profs: string[]) => void;
}

export interface profResponse {
    prof: string;
}

// ProfsSelectionComponant est un composant enfant de Home, c'est le composant affiché dans le menu principal
const ProfsSelectionComponant: React.FC<ProfsSelectionComponantProps> = ({
    onProfsSelection: onProfSelection,
}) => {
  const [profs, setProfs] = useState<profResponse[]>([]);
  const [selectedProfs, setSelectedProfs] = useState<string[]>([])

  // Memoize the onProfSelection function
  const memoizedOnProfSelection = useCallback(onProfSelection, []);

  // useEffect pour récupérer la liste des professeurs au chargement du composant
  useEffect(() => {
    const fetchProfs = async () => {
      try {
        const response: profResponse[] = await doGet("/getProfs");
        setProfs(response);
      } catch (error) {
        console.error("Erreur lors de la récupération des formations:", error);
      }
    };

    fetchProfs();
  }, []);

  // useEffect pour charger la sélection de professeurs sauvegardée
  useEffect(() => {
    const loadSelectedProfs = async () => {
      const { value } = await Preferences.get({ key: 'selectedProfs' });
      if (value) {
        setSelectedProfs(JSON.parse(value));
        memoizedOnProfSelection(JSON.parse(value));
      }
    };

    loadSelectedProfs();
  }, [memoizedOnProfSelection]);

  // handleProfsSelection est une fonction appelée lorsqu'un professeur est sélectionné ou désélectionné
  const handleProfsSelection = async (e: CustomEvent, prof : string) => {
    const isChecked = e.detail.checked;
    let updatedSelectedProfs: string[];
    if (isChecked) {
      updatedSelectedProfs = [...selectedProfs, prof];
    } else {
      updatedSelectedProfs = selectedProfs.filter((selectedProf) => selectedProf !== prof);
    }
    setSelectedProfs(updatedSelectedProfs);
    memoizedOnProfSelection(updatedSelectedProfs);

    // Sauvegarder la sélection de professeurs
    await Preferences.set({
      key: 'selectedProfs',
      value: JSON.stringify(updatedSelectedProfs),
    });
  }

  return (
    <>
      <IonAccordionGroup expand="inset">
        {profs.length > 0 ? (
          <IonAccordion value="profs">
            <IonItem slot="header" color="light">
              <IonLabel>Espace Enseignant</IonLabel>
            </IonItem>
            {profs.map((prof) => (
              <IonItem slot="content" key={prof.prof}>
                <IonToggle 
                  checked={selectedProfs.includes(prof.prof)}
                  onIonChange={(e: CustomEvent<any>) => {handleProfsSelection(e, prof.prof)} }
                >
                  {prof.prof}
                </IonToggle>
              </IonItem>
            ))}
          </IonAccordion>
        ) : (
          <IonSpinner
            style={{ display: "block", margin: "0 auto" }}
          ></IonSpinner>
        )}
      </IonAccordionGroup>
    </>
  );
};

export default ProfsSelectionComponant;

/*

<IonItem slot="content" key={uniqueKey}>
          <IonToggle
            key={uniqueKey}
            checked={selectedProfs.some(
              (selectedGroup) =>
                selectedGroup.nomGroupe === groupe.nomGroupe &&
                selectedGroup.idFormation === groupe.idFormation
            )}
            onIonChange={(e: CustomEvent) => handleGroupSelection(e, groupe)}
          >
            {groupe.nomGroupe}
          </IonToggle>
        </IonItem>
*/