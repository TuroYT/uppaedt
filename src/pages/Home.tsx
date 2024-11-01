import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonMenu, IonButtons, IonMenuButton } from '@ionic/react';
import './Home.css';
import { useState } from 'react';
import { UnEvent, UnGroupe } from '../interfaces';
import SelectionGroupesComponant from '../components/GroupesSelectionComponant';
import CalendarComponant from '../components/CalendarComponant';

const Home: React.FC = () => {
  const [events, setEvents] = useState<UnEvent[]>([])
  const [selectedGroups, setSelectedGroups] = useState<UnGroupe[]>([]);

  const handleGroupSelection = (groups: UnGroupe[]) => {
    setSelectedGroups(groups);
    console.log("Selected groups: ", groups);
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

        <CalendarComponant selectedGroups={selectedGroups}></CalendarComponant>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;
