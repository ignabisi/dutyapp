import React, { useState } from 'react';
import { Layout, Card, Button, Modal, Form, Input, Checkbox } from 'antd';
import { useDutyContext } from '../context/DutyContext';

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const { duties, updateDuty, deleteDuty } = useDutyContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDuty, setSelectedDuty] = useState<any>(null);

  const showEditModal = (duty: any) => {
    setSelectedDuty(duty);
    setIsModalVisible(true);
  };

  const handleOk = (values: any) => {
    updateDuty({ ...selectedDuty, ...values });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedDuty(null);
  };

  const handleDelete = (id: number) => {
    deleteDuty(id);
  };

  return (
    <Content style={{ padding: '0 50px', marginTop: '20px' }}>
      <div className="site-layout-content">
        <h2>Duty List</h2>
        <div className="duty-list">
          {duties.map((duty: any) => (
            <Card key={duty.id} title={duty.title} style={{ marginBottom: '20px' }}>
              <p>Status: {duty.completed ? 'Completed' : 'Pending'}</p>
              <Button type="primary" onClick={() => showEditModal(duty)}>Edit</Button>
              <Button type="dashed" onClick={() => handleDelete(duty.id)} style={{ marginLeft: '10px' }}>
                Delete
              </Button>
            </Card>
          ))}
        </div>
        {/* Modal for editing a duty */}
        {selectedDuty && (
          <Modal
            title="Edit Duty"
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <Form
              initialValues={{
                title: selectedDuty.title,
                completed: selectedDuty.completed,
              }}
              onFinish={handleOk}
            >
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please enter a title!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="completed" valuePropName="checked">
                <Checkbox>Completed</Checkbox>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Save</Button>
              </Form.Item>
            </Form>
          </Modal>
        )}
      </div>
    </Content>
  );
};

export default MainLayout;
