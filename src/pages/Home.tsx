import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonMenu,
  IonButtons,
  IonMenuButton,
  RefresherEventDetail,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import "./Home.css";
import { useState, useCallback } from "react";
import { UnGroupe } from "../interfaces";
import SelectionGroupesComponant from "../components/GroupesSelectionComponant";
import SelectionProfsComponant, { profResponse } from "../components/ProfsSelectionComponant";
import CalendarComponant from "../components/CalendarComponant";
import { NotifComponant } from "../components/notifComponant";

const Home: React.FC = () => {
  const [selectedGroups, setSelectedGroups] = useState<UnGroupe[]>([]);
  const [selectedProfs, setSelectedProfs] = useState<string[]>([]);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    window.location.reload();
  };

  const handleGroupSelection = useCallback((groups: UnGroupe[]) => {
    setSelectedGroups(groups);
  }, []);

  const handleProfsSelection = useCallback((profs: string[]) => {
    setSelectedProfs(profs);
  }, []);

  return (
    <>
      <IonMenu type="push" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Selection des groupes</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <NotifComponant selectedGroups={selectedGroups}></NotifComponant>

          {/* Selections */}
          <SelectionGroupesComponant
            onGroupSelection={handleGroupSelection}
          ></SelectionGroupesComponant>

          <SelectionProfsComponant onProfsSelection={handleProfsSelection}
          ></SelectionProfsComponant>

        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>UPPAEDT {(selectedProfs.length > 0 ? "- Vue Enseignant" : "")}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <CalendarComponant
            selectedGroups={selectedGroups}
            selectedProfs={selectedProfs}
          ></CalendarComponant>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;
