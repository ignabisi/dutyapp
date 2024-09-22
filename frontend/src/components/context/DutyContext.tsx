import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface Duty {
  id: number;
  title: string;
  completed: boolean;
}

interface DutyContextType {
  duties: Duty[];
  refreshDuties: () => void;
  addDuty: (newDuty: Omit<Duty, 'id'>) => Promise<void>;
  updateDuty: (updatedDuty: Duty) => Promise<void>;
  deleteDuty: (id: number) => Promise<void>;
}

const DutyContext = createContext<DutyContextType | undefined>(undefined);
const apiHostname = process.env.API_HOSTNAME || 'localhost';
const apiPort = process.env.PORT || '3002';


export const useDutyContext = () => {
  const context = useContext(DutyContext);
  if (!context) {
    throw new Error('useDutyContext must be used within a DutyProvider');
  }
  return context;
};

export const DutyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [duties, setDuties] = useState<Duty[]>([]);
  const fetchDuties = async () => {
    try {
      const response = await axios.get<Duty[]>(`http://${apiHostname}:${apiPort}/duties`);
      setDuties(response.data);
    } catch (error) {
      console.error('Error fetching duties:', error);
    }
  };

  // Function to add a new duty
  const addDuty = async (newDuty: Omit<Duty, 'id'>) => {
    try {
      const response = await axios.post<Duty>(`http://${apiHostname}:${apiPort}/duties`, newDuty);
      setDuties((prevDuties) => [...prevDuties, response.data]);
    } catch (error) {
      console.error('Error adding duty:', error);
    }
  };

  const updateDuty = async (updatedDuty: Duty) => {
    try {
      await axios.put(`http://${apiHostname}:${apiPort}/duties/${updatedDuty.id}`, updatedDuty);
      setDuties((prevDuties) =>
        prevDuties.map((duty) => (duty.id === updatedDuty.id ? updatedDuty : duty))
      );
    } catch (error) {
      console.error('Error updating duty:', error);
    }
  };

  const deleteDuty = async (id: number) => {
    try {
      await axios.delete(`http://${apiHostname}:${apiPort}/duties/${id}`);
      setDuties((prevDuties) => prevDuties.filter((duty) => duty.id !== id));
    } catch (error) {
      console.error('Error deleting duty:', error);
    }
  };

  const refreshDuties = () => {
    fetchDuties();
  };

  useEffect(() => {
    fetchDuties();
  }, []);

  return (
    <DutyContext.Provider value={{ duties, refreshDuties, addDuty, updateDuty, deleteDuty }}>
      {children}
    </DutyContext.Provider>
  );
};
