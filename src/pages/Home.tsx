import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonMenu, IonButtons, IonMenuButton } from '@ionic/react';
import './Home.css';
import { useState } from 'react';
import { UnEvent } from '../interfaces';
import SelectionGroupesComponant from '../components/GroupesSelectionComponant';

const Home: React.FC = () => {
  const [events, setEvents] = useState<UnEvent[]>([])

  return (
    <>
      <IonMenu type='push' contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu Content</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <SelectionGroupesComponant></SelectionGroupesComponant>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">


        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;
