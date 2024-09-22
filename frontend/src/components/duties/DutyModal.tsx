import React, { useEffect } from 'react';
import { Modal, Form, Input, Checkbox, Button } from 'antd';
import './Duties.css';

const DutyModal: React.FC<{
  open: boolean;
  isEditing: boolean;
  selectedDuty: any;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}> = ({ open, isEditing, selectedDuty, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedDuty) {
      form.setFieldsValue({
        title: selectedDuty.title,
        completed: selectedDuty.completed,
      });
    } else {
      form.resetFields();
    }
  }, [selectedDuty, form]);

  return (
    <Modal
      title={isEditing ? 'Edit Duty' : 'Add Duty'}
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}  // Attach the form instance
        onFinish={onSubmit}
        initialValues={{ title: '', completed: false }} // Default values for new duty
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
          <Button type="primary" htmlType="submit">
            {isEditing ? 'Save' : 'Add'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DutyModal;
