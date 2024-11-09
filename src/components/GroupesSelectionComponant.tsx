import React, { useState, useEffect } from "react";
import { UneFormation, UnGroupe } from "../interfaces";
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

interface GroupesSelectionComponantProps {
  onGroupSelection: (groups: UnGroupe[]) => void;
}

// FormationComponent is a child component of GroupesSelectionComponant
const FormationComponent = ({
  formation,
  onGroupSelection,
}: {
  formation: UneFormation;
  onGroupSelection: (groups: UnGroupe[]) => void;
}) => {
  const [groups, setGroups] = useState<UnGroupe[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<UnGroupe[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response: UnGroupe[] = await doPost(
          "/formation/getGroups",
          "idFormation=" + formation.idFormation
        );

        setGroups(response);
      } catch (error) {
        console.error("Error fetching formations:", error);
      }
    };

    const loadSelectedGroups = async () => {
      const { value } = await Preferences.get({ key: `selectedGroupes` });
      if (value) {
        setSelectedGroups(JSON.parse(value));
        onGroupSelection(JSON.parse(value));
      }
    };

    fetchGroups();
    loadSelectedGroups();
  }, [formation.idFormation]);

  const handleGroupSelection = async (e: CustomEvent, groupe: UnGroupe) => {
    let updatedGroups;
    if (
      selectedGroups.some(
        (g) =>
          g.nomGroupe === groupe.nomGroupe &&
          g.idFormation === groupe.idFormation
      )
    ) {
      updatedGroups = selectedGroups.filter(
        (g) =>
          g.nomGroupe !== groupe.nomGroupe ||
          g.idFormation !== groupe.idFormation
      );
    } else {
      updatedGroups = [...selectedGroups, groupe];
    }

    try {
      // Save it to memory
      await Preferences.set({
        key: "selectedGroupes",
        value: JSON.stringify(updatedGroups),
      });

      // Update state after saving preferences
      setSelectedGroups(updatedGroups);
      onGroupSelection(updatedGroups);
      console.log(selectedGroups);
    } catch (error) {
      console.error("Error saving selected groups:", error);
    }
  };

  return (
    <IonAccordion key={formation.idFormation}>
      <IonItem slot="header" color="light">
        <IonLabel>{formation.nom}</IonLabel>
      </IonItem>
      {groups.map((groupe) => {
        const uniqueKey = `${groupe.nomGroupe}-${groupe.idFormation}`;
        return (
          <IonItem slot="content" key={uniqueKey}>
            <IonToggle
              key={uniqueKey}
              checked={selectedGroups.some(
                (selectedGroup) =>
                  selectedGroup.nomGroupe === groupe.nomGroupe &&
                  selectedGroup.idFormation === groupe.idFormation
              )}
              onIonChange={(e: CustomEvent) => handleGroupSelection(e, groupe)}
            >
              {groupe.nomGroupe}
            </IonToggle>
          </IonItem>
        );
      })}
    </IonAccordion>
  );
};

// GroupesSelectionComponant is a child component of Home, c'est le composant affiché dans le menu principal
const GroupesSelectionComponant: React.FC<GroupesSelectionComponantProps> = ({
  onGroupSelection,
}) => {
  const [formations, setFormations] = useState<UneFormation[]>([]);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response: UneFormation[] = await doGet("/formations/getAll");
        setFormations(response);
      } catch (error) {
        console.error("Error fetching formations:", error);
      }
    };

    fetchFormations();
  }, []);

  return (
    <>
      <IonAccordionGroup expand="inset">
        {formations.length > 0 ? (
          formations.map((formation) => (
            <FormationComponent
              key={formation.idFormation}
              formation={formation}
              onGroupSelection={onGroupSelection}
            />
          ))
        ) : (
          <IonSpinner
            style={{ display: "block", margin: "0 auto" }}
          ></IonSpinner>
        )}
      </IonAccordionGroup>
    </>
  );
};

export default GroupesSelectionComponant;
