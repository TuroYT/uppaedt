import { Preferences } from "@capacitor/preferences";
import { UnCours, UnGroupe } from "../interfaces";
import { IonCard, IonCardHeader, IonToggle } from "@ionic/react";
import React, { useEffect, useState } from "react";
import {
  LocalNotificationSchema,
  LocalNotifications,
} from "@capacitor/local-notifications";
import "./notifs.css";
import { doPost } from "../utils/Requests";

interface ContainerProps {
  selectedGroups: UnGroupe[];
}

export const NotifComponant: React.FC<ContainerProps> = ({
  selectedGroups,
}) => {
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    setChecked(!checked);
    Preferences.set({
      key: `notificationIsActive`,
      value: JSON.stringify(!checked),
    });
  };

  useEffect(() => {
    
    const loadDefaultChecked = async () => {
      const { value } = await Preferences.get({ key: `notificationIsActive` });
      if (value != null) {
        setChecked(JSON.parse(value));
      }
    };

    //récupération des prochains cours
    const addNotifs = async () => {
      const response: UnCours[] = await doPost(
        "/planning/GetPlanningIdFomrationNomGroupe",
        {
          nomGroupes: selectedGroups
            .map((g) => {
              return g.nomGroupe;
            })
            .join(","), // Replace with the actual nomGroupe if it's dynamic
          idFormations: selectedGroups
            .map((g) => {
              return g.idFormation;
            })
            .join(","), // Replace with the actual idFormation if it's dynamic
          rangeDate: 10, // Replace with the actual rangeDate if it's dynamic
          centerDate: new Date(), // Replace with the actual centerDate if it's dynamic
        }
      );

      if (checked) {
        LocalNotifications.requestPermissions();
        // clear anciennes notifs
        LocalNotifications.cancel({
          notifications: (await LocalNotifications.getPending()).notifications,
        });
        let toAdd: LocalNotificationSchema[] = [];

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
            console.log("Notif ajoutée : ",notification );
          }
        });

        // ajout des notifs
        LocalNotifications.schedule({ notifications: toAdd });
        //console.log("Notifs ajoutées : ",response );
      } else {
        LocalNotifications.cancel({
          notifications: (await LocalNotifications.getPending()).notifications,
        });
      }
    };

    loadDefaultChecked();
    addNotifs();
  }, [selectedGroups, checked]);

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonToggle onClick={handleCheck} checked={checked}>
            <>
              <p className="darkText">Activer les notifications ?</p>
            </>
          </IonToggle>
        </IonCardHeader>
      </IonCard>
    </>
  );
};
