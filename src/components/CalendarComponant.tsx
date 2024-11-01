import { useEffect, useState } from 'react';
import { UnCours, UnGroupe } from '../interfaces';
import { doGet, doPost } from '../utils/Requests';


interface ContainerProps { 
  selectedGroups: UnGroupe[];
}

const CalendarComponant: React.FC<ContainerProps> = ({selectedGroups}) => {
  const [events, setEvents] = useState<UnCours[]>([])

  useEffect(() => {
   const fetchEvents = async () => {
    selectedGroups.map(async (g) => {

      try {
        const response: UnCours[] = await doPost("/planning/GetPlanningIdFomrationNomGroupe",  {
          nomGroupe: g.nomGroupe,
          idFormation: g.idFormation, // Replace with the actual idFormation if it's dynamic
          rangeDate: 6, // Replace with the actual rangeDate if it's dynamic
          centerDate: new Date() // Replace with the actual centerDate if it's dynamic
        })
        
        setEvents(response); // ! marche que pour un groupe
      } catch (error) {
        console.error("Error fetching events:", error);
      }


    })

      
    }
    
    fetchEvents();


  }, [selectedGroups]);




  return (
    <>{selectedGroups.map((g) => {return g.nomGroupe})}</>
  );
};

export default CalendarComponant;
