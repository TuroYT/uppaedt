import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonMenu, IonButtons, IonMenuButton, RefresherEventDetail, IonRefresher, IonRefresherContent } from '@ionic/react';
import './Home.css';
import { useState } from 'react';
import { UnCours, UnGroupe } from '../interfaces';
import SelectionGroupesComponant from '../components/GroupesSelectionComponant';
import CalendarComponant from '../components/CalendarComponant';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [selectedGroups, setSelectedGroups] = useState<UnGroupe[]>([]);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    window.location.reload();
  }

  const handleGroupSelection = (groups: UnGroupe[]) => {
    setSelectedGroups(groups);
  };

  return (
    <>
      <IonMenu type='push' contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Selection des groupes</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          
        
        
          <SelectionGroupesComponant onGroupSelection={handleGroupSelection}></SelectionGroupesComponant>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>UPPAEDT</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <CalendarComponant selectedGroups={selectedGroups}></CalendarComponant>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;
