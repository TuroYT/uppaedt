import { Preferences } from "@capacitor/preferences";
import { UnCours } from "../interfaces";
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox, IonToggle } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import {
    LocalNotificationSchema,
    LocalNotifications,
  } from "@capacitor/local-notifications";

interface ContainerProps {
    cours: UnCours[];
}


export const NotifComponant :  React.FC<ContainerProps> = ({cours}) => {
    const [checked, setChecked] = useState(false)

    const handleCheck = () =>{
        setChecked(!checked)
        Preferences.set({key : `notificationIsActive`, value : JSON.stringify(!checked)})
    }

    useEffect(() => {
        const loadDefaultChecked = async () => {
            const { value } = await Preferences.get({ key: `notificationIsActive` });
            if (value != null) {
                setChecked(JSON.parse(value))
            }
        }

        // ajout des notifications
        const addNotifs = async () => {
            if (checked) {
                LocalNotifications.requestPermissions()
                // clear anciennes notifs
                LocalNotifications.cancel({notifications: (await LocalNotifications.getPending()).notifications})
                let toAdd: LocalNotificationSchema[] = [];
                
                
                cours.map((cour)=>{

                    // cours futur
                    if (cour.dateDeb > new Date()) {
                        const notification: LocalNotificationSchema = {
                            title: "Dans 10 minutes : " + cour.nomCours,
                            body: cour.lieu,
                            id: cour.idCours,
                            channelId: '1',
                            schedule: { at: new Date(new Date(cour.dateDeb).getTime() - 10 * 60000), allowWhileIdle : true }, // Schedule 10 minutes before the course
                          };
                        toAdd.push(notification);
                    }

                    
                })
                

                // ajout des notifs
                LocalNotifications.schedule({notifications: toAdd})
            } else {
                LocalNotifications.cancel({notifications: (await LocalNotifications.getPending()).notifications})
            }
        }



        loadDefaultChecked()
        addNotifs()
    }, [checked, cours])

    return (
    <>
    <IonCard>
        <IonCardHeader>
        <IonToggle onClick={handleCheck} checked={checked}><><strong className="darkText">Activer les notifications ?</strong></></IonToggle>
        </IonCardHeader>
        
    </IonCard>
    </>
)
}