import { Preferences } from "@capacitor/preferences";
import { UnCours, UnGroupe } from "../interfaces";
import { IonCard, IonCardHeader, IonItem, IonLabel, IonToggle } from "@ionic/react";
import React, { useEffect, useState } from "react";

import {
  LocalNotificationSchema,
  LocalNotifications,
} from "@capacitor/local-notifications";
import "./notifs.css";
import { doPost } from "../utils/Requests";
import { Capacitor } from "@capacitor/core";
//import { PrintMsg } from "../utils/PrintMsg";

interface ContainerProps {
  selectedGroups: UnGroupe[];
}

export const NotifComponant: React.FC<ContainerProps> = ({
  selectedGroups,
}) => {
  const [checked, setChecked] = useState(false);
  const [notifs, setnotifs] = useState('');

  const handleCheck = () => {
    setChecked(!checked);
    Preferences.set({
      key: `notificationIsActive`,
      value: JSON.stringify(!checked),
    });
  };

  useEffect(() => {
    const MakeChannel = async () => {
      if (Capacitor.getPlatform() !== 'web') {
        const currentChannels = await LocalNotifications.listChannels();
        if (!currentChannels.channels.some((channel) => channel.id === '1')) {
          LocalNotifications.createChannel({
            id: '1',
            name: 'events',
            description: 'notif avant les cours',
            importance: 3,
            visibility: 1,
            vibration: true,
            sound: 'sound_name.wav'
          });
        }
      } else {
        console.warn("LocalNotifications plugin is not implemented on web.");
      }
    };
    
    const loadDefaultChecked = async () => {
      const { value } = await Preferences.get({ key: `notificationIsActive` });
      if (value != null) {
        setChecked(JSON.parse(value));
      }
    };

    //récupération des prochains cours
    const addNotifs = async () => {
      let response: UnCours[] = await doPost(
        "/planning/GetPlanningIdFomrationNomGroupe",
        {
          nomGroupes: selectedGroups
            .map((g) => g.nomGroupe)
            .join(","),
          idFormations: selectedGroups
            .map((g) => g.idFormation)
            .join(","),
          rangeDate: 10,
          centerDate: new Date(),
          profs: "",
        }
      );
      const uniqueCourses = new Map<string, UnCours>();

      response.forEach((c) => {
        const key = `${c.nomCours}-${c.dateDeb}-${c.dateFin}-${c.prof}-${c.lieu}`;
        if (!uniqueCourses.has(key)) {
          uniqueCourses.set(key, c);
        }
      });

      response = Array.from(uniqueCourses.values());

      if (checked) {
         LocalNotifications.requestPermissions();
        // clear anciennes notifs
         LocalNotifications.cancel({
          notifications: (await LocalNotifications.getPending()).notifications,
        });
        let toAdd: LocalNotificationSchema[] = [];
        setnotifs(JSON.stringify(toAdd))
        response.map((cour) => {
          // cours futur
          
           console.log(new Date(cour.dateDeb) > new Date())
          if (new Date(cour.dateDeb) > new Date()) {
            const notification: LocalNotificationSchema = {
              title: "Dans 10 minutes : " + cour.nomCours,
              body: cour.lieu,
              id: cour.idCours,
              channelId: "1",
              schedule: {
                at: new Date(new Date(cour.dateDeb).getTime() - 10 * 60000),
                allowWhileIdle: true,
              }, // Schedule 10 minutes before the course
            };
            toAdd.push(notification);
            //console.log("Notif ajoutée : ",notification );
          }
        });

        // ajout des notifs
        //console.log(toAdd)
        
        let results = await LocalNotifications.schedule({ notifications: toAdd });
        setnotifs(JSON.stringify(results))
        //await PrintMsg('Info', JSON.stringify(results))
        
        console.log(toAdd)
        
        //console.log("Notifs ajoutées : ",response );
      } else {
        await LocalNotifications.cancel({
          notifications: (await LocalNotifications.getPending()).notifications,
        });
      }
    };

    loadDefaultChecked();
    MakeChannel();
    addNotifs();
  }, [selectedGroups, checked]);

  return (
    <>
      <IonCard className="notif-card">
        <IonCardHeader className="notif-card-header">
          <IonItem lines="none" className="notification-toggle">
            <IonLabel>Activer les notifications ?</IonLabel>
            <IonToggle 
              onClick={handleCheck} 
              checked={checked}
              slot="end"
            />
          </IonItem>
        </IonCardHeader>
      </IonCard>
    </>
  );
};
