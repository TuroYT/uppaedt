import React, { useEffect, useState } from "react";
import { IonToggle, IonItem, IonIcon, IonLabel } from "@ionic/react";
import { moon, sunny } from "ionicons/icons";
import { Preferences } from "@capacitor/preferences";

const DarkModeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load dark mode preference
    const loadDarkMode = async () => {
      const { value } = await Preferences.get({ key: "darkMode" });
      setDarkMode(value === "true");
      if (value === "true") {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    };

    loadDarkMode();
  }, []);

  const toggleDarkMode = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    
    await Preferences.set({
      key: "darkMode",
      value: String(newDarkMode),
    });
  };

  return (
    <IonItem lines="none">
      
      <IonLabel>Mode sombre</IonLabel>
      <IonToggle 
        checked={darkMode} 
        onIonChange={toggleDarkMode} 
        slot="end"
      />
      {darkMode ? <IonIcon icon={moon} slot="end" /> : <IonIcon icon={sunny} slot="end" />}
      
    </IonItem>
  );
};

export default DarkModeToggle;
