import React, { useState } from 'react';
import { Layout, Button } from 'antd';
import DutyList from '../duties/DutyList';
import DutyModal from '../duties/DutyModal';
import { useDutyContext } from '../context/DutyContext';

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const { addDuty, updateDuty, refreshDuties, deleteDuty } = useDutyContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDuty, setSelectedDuty] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const showEditModal = (duty: any) => {
    setSelectedDuty(duty);
    setIsEditing(true);
    setIsModalVisible(true);
  };

  const showAddModal = () => {
    setSelectedDuty(null);
    setIsEditing(false);
    setIsModalVisible(true);
  };

  const handleOk = async (values: any) => {
    if (isEditing) {
      await updateDuty({ ...selectedDuty, ...values });
    } else {
      await addDuty({ title: values.title, completed: values.completed || false });
    }
    setIsModalVisible(false);
    setSelectedDuty(null);
    await refreshDuties();
  };

  const handleDelete = async (id: number) => {
    await deleteDuty(id);
    await refreshDuties();
  };

  return (
    <Content style={{ padding: '0 50px', marginTop: '20px' }}>
      <div className="site-layout-content">
        <h2 className="duty-list-title">Duty List</h2>
        <DutyList onEdit={showEditModal} onDelete={handleDelete} />
        <Button type="primary" onClick={showAddModal} style={{ marginBottom: '10px', marginTop: '20px' }}>
          Add New Duty
        </Button>
        <DutyModal
          visible={isModalVisible}
          isEditing={isEditing}
          selectedDuty={selectedDuty}
          onCancel={() => setIsModalVisible(false)}
          onSubmit={handleOk}
        />
      </div>
    </Content>
  );
};

export default MainLayout;
