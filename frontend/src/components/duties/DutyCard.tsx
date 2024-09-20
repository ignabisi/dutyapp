import React from 'react';
import { Card, Button } from 'antd';
import './Duties.css'

const DutyCard: React.FC<{ duty: any; onEdit: (duty: any) => void; onDelete: (id: number) => void }> = ({ duty, onEdit, onDelete }) => {
  return (
    <Card title={duty.title || 'Untitled'} style={{ marginBottom: '20px' }}>
      <p>Status: {duty.completed ? 'Completed' : 'Pending'}</p>
      <Button type="primary" onClick={() => onEdit(duty)}>Edit</Button>
      <Button type="dashed" onClick={() => onDelete(duty.id)} style={{ marginLeft: '10px' }}>
        Delete
      </Button>
    </Card>
  );
};

export default DutyCard;
