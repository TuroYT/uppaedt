import { useEffect, useRef, useState } from "react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { UnCours, UnGroupe } from "../interfaces";
import { doPost } from "../utils/Requests";
import "./Calendar.css";
import FullCalendar from "@fullcalendar/react";
import {
  IonButton,
  IonButtons,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { useSwipeable } from "react-swipeable";
import { caretBackOutline, caretForwardOutline } from "ionicons/icons";
import { EventInput } from "@fullcalendar/core";

interface ContainerProps {
  selectedGroups: UnGroupe[];
  selectedProfs: string[];
}
interface EventInfo {
  cours: string;
  location: string;
  prof: string;
  start: Date;
  end: Date;
  isLastCours: boolean;
  groupe: string;
}

const CalendarComponant: React.FC<ContainerProps> = ({
  selectedGroups,
  selectedProfs
}) => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const modal = useRef<HTMLIonModalElement | null>(null);
  const calendarRef = useRef<FullCalendar | null>(null);
  const modalRef = useRef<HTMLIonModalElement | null>(null);
  const datetimeRef = useRef<HTMLIonDatetimeElement | null>(null);
  const swiperRef = useRef<any>(null); // Assuming swiperRef is from a library that doesn't have TypeScript types
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [eventInfo, setEventInfo] = useState<EventInfo>({
    cours: "",
    location: "",
    prof: "",
    start: new Date(),
    end: new Date(),
    isLastCours: false,
    groupe: "",
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Check for dark mode
  useEffect(() => {
    // Initial check
    setIsDarkMode(document.body.classList.contains('dark'));

    // Create observer to watch for class changes on body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.body.classList.contains('dark'));
        }
      });
    });

    // Start observing
    observer.observe(document.body, { attributes: true });

    // Cleanup
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response: UnCours[] = await doPost(
          "/planning/GetPlanningIdFomrationNomGroupe",
          {
            nomGroupes: selectedGroups
              .map((g) => g.nomGroupe)
              .join(","),
            idFormations: selectedGroups
              .map((g) => g.idFormation)
              .join(","),
            rangeDate: 10,
            centerDate: currentDate,
            profs: selectedProfs.join(","),
          }
        );

        let events: EventInput[] = [];
        let color;
        const uniqueCourses = new Map<string, UnCours>();

        response.forEach((c) => {
          const key = `${c.nomCours}-${c.dateDeb}-${c.dateFin}-${c.prof}-${c.lieu}`;
          if (!uniqueCourses.has(key)) {
            uniqueCourses.set(key, c);
          }
        });

        uniqueCourses.forEach((c) => {
          if (c.nomGroupe == "NA") {
            color = "red";
          } else if (c.prof == "NA") {
            color = "#005049";
          } else {
            color = "default";
          }
          events.push({
            title: c.nomCours,
            start: c.dateDeb,
            end: c.dateFin,
            description: c.prof,
            id: c.idCours.toString(),
            color: color, // vert pour cours en autonomie
            extendedProps: {
              prof: c.prof,
              cours: c.nomCours,
              location: c.lieu,
              isLastCours: false,
              start: c.dateDeb,
              end: c.dateFin,
              groupe: c.nomGroupe,
            },
          });
        });

        setEvents(events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [selectedGroups, selectedProfs, currentDate]);

  function goNext() {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.next();
    refreshDate();
  }
  function goBack() {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.prev();
    refreshDate();
  }
  function today() {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.today();
    refreshDate();
  }

  function setNewDate() {
    modalRef.current?.dismiss();
    const calendarApi = calendarRef.current?.getApi();
    const dateValue = datetimeRef.current?.value;
    if (dateValue) {
      if (typeof dateValue === "string") {
        calendarApi?.gotoDate(new Date(dateValue));
      }
    }
    refreshDate();
  }

  function refreshDate() {
    const calendarApi = calendarRef.current?.getApi();
    setCurrentDate(calendarApi?.getDate() || new Date());
  }

  // verifie si c'est un weekend
  const isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  };

  const onSwipe = () => {
    if (swiperRef.current.activeIndex === 0) {
      goBack();
    } else {
      goNext;
    }
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(1);
    }
  };
  const handlers = useSwipeable({
    onSwipedLeft: () => goNext(),
    onSwipedRight: () => goBack(),
  });

  const renderEventContent = (eventInfo: {
    timeText: any;
    event: {
      extendedProps: {
        cours: string;
        location: string;
        prof: string;
        start: string;
        end: string;
        isLastCours: boolean;
        groupe: string;
      };
    };
  }) => {
    // Evevent Render
    return (
      <>
        <>{eventInfo.timeText}</>
        <br />
        {eventInfo.event.extendedProps.cours.length > 33
          ? eventInfo.event.extendedProps.cours.slice(0, 30) + " ..."
          : eventInfo.event.extendedProps.cours}
        <br />
        <i>{eventInfo.event.extendedProps.location}</i>
        <br />

        {eventInfo.event.extendedProps.prof != "NA" ? (
          <i>{eventInfo.event.extendedProps.prof}</i>
        ) : (
          ""
        )}
      </>
    );
  };

  return (
    <>
      {
        <>
          <div id="main" {...handlers}>
            <div className="center">
                <IonButton
                id="datetime-picker"
                shape="round"
                size="large"
                color={isDarkMode ? "dark" : "primary"}
                fill={isDarkMode ? "solid" : "outline"}
                >   
                {currentDate.toLocaleDateString("fr-FR")}
                </IonButton>
              <br />
              <IonButton onClick={today} color={isDarkMode ? "dark" : "primary"}>Ajourd'hui</IonButton>
              <IonButton onClick={goBack} slot="icon-only" color={isDarkMode ? "dark" : "primary"}>
                <IonIcon slot="icon-only" icon={caretBackOutline}></IonIcon>
              </IonButton>
              <IonButton onClick={goNext} slot="icon-only" color={isDarkMode ? "dark" : "primary"}>
                <IonIcon slot="icon-only" icon={caretForwardOutline}></IonIcon>
              </IonButton>
            </div>

            <IonModal
              keepContentsMounted={true}
              trigger="datetime-picker"
              ref={modalRef}
            >
              <IonDatetime
                id="datetime"
                presentation="date"
                onIonChange={setNewDate}
                ref={datetimeRef}
                firstDayOfWeek={1}
                isDateEnabled={isWeekday}
              ></IonDatetime>
            </IonModal>

            <IonModal ref={modal} id="modalevent">
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="end">
                    <IonButton onClick={() => modal.current?.dismiss()}>
                      ok
                    </IonButton>
                  </IonButtons>
                  <IonTitle>{eventInfo.cours}</IonTitle>
                </IonToolbar>
              </IonHeader>

              <IonList>
                {eventInfo.groupe == "NA" ? (
                  <IonItem>
                    <IonLabel>
                      <h2 className="redText">Exceptionnel</h2>
                    </IonLabel>
                  </IonItem>
                ) : (
                  ""
                )}
                <IonItem>
                  <IonLabel>
                    <p>Cours</p>
                    {eventInfo.cours}
                  </IonLabel>
                </IonItem>
                {eventInfo.groupe != "NA" ? (
                  <IonItem>
                    <IonLabel>
                      <p>Groupe</p>
                      {eventInfo.groupe}
                    </IonLabel>
                  </IonItem>
                ) : (
                  ""
                )}
                {eventInfo.prof != "NA" ? (
                  <IonItem>
                    <IonLabel>
                      <p>Professeur</p>
                      {eventInfo.prof}
                    </IonLabel>
                  </IonItem>
                ) : (
                  ""
                )}

                <IonItem>
                  <IonLabel>
                    <p>Lieu</p>
                    {eventInfo.location}
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <p>Heure</p>
                    {new Date(eventInfo.start).toLocaleTimeString()} -{" "}
                    {new Date(eventInfo.end).toLocaleTimeString()}
                  </IonLabel>
                </IonItem>
                {eventInfo.isLastCours ? (
                  <IonItem>
                    <IonLabel>
                      <h2>Dernier cours du module programmé</h2>
                    </IonLabel>
                  </IonItem>
                ) : (
                  ""
                )}
              </IonList>
            </IonModal>
            <FullCalendar
              slotEventOverlap={false}
              ref={calendarRef}
              plugins={[timeGridPlugin]}
              initialView="timeGridDay"
              locale="fr"
              headerToolbar={{
                start: "",
                center: "",
                end: "",
              }}
              titleFormat={{ month: "long", day: "numeric" }}
              hiddenDays={[6, 0]}
              events={events}
              allDaySlot={false}
              nowIndicator={true}
              height="auto"
              slotMinTime="08:00"
              slotMaxTime="19:00"
              eventContent={renderEventContent}
              eventClick={(event) => {
                setEventInfo({
                  cours: event.event.extendedProps.cours,
                  location: event.event.extendedProps.location,
                  prof: event.event.extendedProps.prof,
                  start: event.event.extendedProps.start,
                  end: event.event.extendedProps.end,
                  isLastCours: event.event.extendedProps.isLastCours,
                  groupe: event.event.extendedProps.groupe,
                });
                modal.current?.present();
              }}
            />
          </div>
        </>
      }
    </>
  );
};

export default CalendarComponant;
