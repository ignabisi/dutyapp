import React from 'react';
import DutyCard from './DutyCard';
import { useDutyContext } from '../context/DutyContext';
import './Duties.css'

const DutyList: React.FC<{ onEdit: (duty: any) => void; onDelete: (id: number) => void }> = ({ onEdit, onDelete }) => {
  const { duties } = useDutyContext();

  return (
    <div className="duty-list">
      {duties.map((duty: any) => (
        <DutyCard key={duty.id} duty={duty} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default DutyList;
