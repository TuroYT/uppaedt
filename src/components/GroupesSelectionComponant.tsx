import React, { useState, useEffect } from 'react';
import { UneFormation, UnGroupe } from '../interfaces';
import { doGet, doPost } from '../utils/Requests';

const FormationComponent = ({ formation }: { formation: UneFormation }) => {
    const [groups, setGroups] = useState<UnGroupe[]>([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response: UnGroupe[] = await doPost("/formation/getGroups", 'idFormation='+ formation.idFormation );
                console.log(response)
                setGroups(response);
            } catch (error) {
                console.error("Error fetching formations:", error);
            }
        };

        fetchGroups();
    }, [formation.idFormation]);

    return (
        <h1>{formation.nom}<br></br> -{groups[0]?.nomGroupe}-</h1>
    );
};

const GroupesSelectionComponant = () => {
    const [formations, setFormations] = useState<UneFormation[]>([]);

    useEffect(() => {
        const fetchFormations = async () => {
            try {
                const response: UneFormation[] = await doGet("/formations/getAll");
                setFormations(response);
            } catch (error) {
                console.error("Error fetching formations:", error);
            }
        };

        fetchFormations();
    }, []);

    return (
        <>
            {formations.map((formation) => (
                <FormationComponent key={formation.idFormation} formation={formation} />
            ))}
        </>
    );
};

export default GroupesSelectionComponant;