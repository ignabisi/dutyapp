import React from 'react';
import { useDutyContext } from '../context/DutyContext';

const DutyList: React.FC = () => {
  const { duties, refreshDuties } = useDutyContext();

  return (
    <div>
      <button onClick={refreshDuties}>Refresh Duties</button>
      <ul>
        {duties.map((duty) => (
          <li key={duty.id}>
            {duty.title} - {duty.completed ? 'Completed' : 'Not completed'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DutyList;