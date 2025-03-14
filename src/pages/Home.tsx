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
  IonSpinner,
  IonItem,
  IonList,
} from "@ionic/react";
import "./Home.css";
import { useState, useCallback, lazy, Suspense } from "react";
import { UnGroupe } from "../interfaces";
import SelectionGroupesComponant from "../components/GroupesSelectionComponant";
import SelectionProfsComponant from "../components/ProfsSelectionComponant";
import DarkModeToggle from "../components/DarkModeToggle";
// Import avec lazy loading pour réduire le bundle initial
const CalendarComponant = lazy(() => import("../components/CalendarComponant"));
const NotifComponant = lazy(() => import("../components/notifComponant").then(module => ({ default: module.NotifComponant })));

const Home: React.FC = () => {
  const [selectedGroups, setSelectedGroups] = useState<UnGroupe[]>([]);
  const [selectedProfs, setSelectedProfs] = useState<string[]>([]);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    setTimeout(() => {
      // Rafraîchissement plus efficace sans recharger la page entière
      event.detail.complete();
      // Actualiser seulement les données nécessaires
    }, 1000);
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
          <IonList>
            <DarkModeToggle />
          </IonList>
          
          <Suspense fallback={<IonSpinner name="crescent" />}>
            <NotifComponant selectedGroups={selectedGroups}></NotifComponant>
          </Suspense>

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
          <Suspense fallback={<IonSpinner name="crescent" />}>
            <CalendarComponant
              selectedGroups={selectedGroups}
              selectedProfs={selectedProfs}
            ></CalendarComponant>
          </Suspense>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;
