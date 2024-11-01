import React, { useState, useEffect } from "react";
import { UneFormation, UnGroupe } from "../interfaces";
import { doGet, doPost } from "../utils/Requests";
import {
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonLoading,
  IonSpinner,
  IonToggle,
} from "@ionic/react";

interface GroupesSelectionComponantProps {
    onGroupSelection: (groups: UnGroupe[]) => void;
  }

// FormationComponent is a child component of GroupesSelectionComponant
const FormationComponent = ({ formation, onGroupSelection }: { formation: UneFormation, onGroupSelection: (groups: UnGroupe[]) => void }) => {
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

    fetchGroups();
  }, [formation.idFormation]);

  const handleGroupSelection = (e : CustomEvent, groupe : UnGroupe) => {
    
    let updatedGroups;
    if (e.detail.checked) {
      updatedGroups = [...selectedGroups, groupe];
    } else {
      updatedGroups = selectedGroups.filter((g) => g !== groupe);
    }
    setSelectedGroups(updatedGroups);
    onGroupSelection(updatedGroups);
    
  }

  return (
    <IonAccordion>
      <IonItem slot="header" color="light">
        <IonLabel>{formation.nom}</IonLabel>
      </IonItem>
      {groups.map((groupe) => {
        return (
          <>
            <IonItem slot="content" key={groupe.nomGroupe}>
              <IonToggle onIonChange={(e : CustomEvent) => {handleGroupSelection(e, groupe)}}>{groupe.nomGroupe}</IonToggle>
            </IonItem>
          </>
        );
      })}
    </IonAccordion>
  );
};

// GroupesSelectionComponant is a child component of Home, c'est le composant affiché dans le menu principal    
const GroupesSelectionComponant : React.FC<GroupesSelectionComponantProps> = ({ onGroupSelection }) => {
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
