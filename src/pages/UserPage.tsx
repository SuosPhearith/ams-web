import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RiBuilding4Line, RiDeleteBin3Line } from "react-icons/ri";
import { FiPlusCircle } from "react-icons/fi";
import { LiaEdit } from "react-icons/lia";
import { GrSchedules } from "react-icons/gr";

const { Option } = Select;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/users");
      setUsers(response.data.data);
    } catch (error) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Add/Edit User
  const handleSubmit = async (values: any) => {
    try {
      if (isEditMode && selectedUser) {
        await axios.patch(`http://localhost:8000/api/users/${selectedUser.id}`, values);
        message.success("User updated successfully!");
      } else {
        await axios.post("http://localhost:8000/api/users", values);
        message.success("User created successfully!");
      }
      fetchUsers();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save user");
    }
  };

  // Open Modal for Add/Edit
  const openModal = (user?: User) => {
    if (user) {
      setIsEditMode(true);
      setSelectedUser(user);
      form.setFieldsValue(user);
    } else {
      setIsEditMode(false);
      setSelectedUser(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Delete User
  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/users/${id}`);
      message.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      message.error("Failed to delete user");
    }
  };
  const navigate = useNavigate()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <RiBuilding4Line size={30} />
          <h1 className="text-2xl">User Management</h1>
        </div>
        <Button type="primary" onClick={() => openModal()}> <FiPlusCircle />Add</Button>
      </div>

      <Table dataSource={users} rowKey="id" loading={loading} pagination={false}>
        <Table.Column title="Name" dataIndex="name" key="name" />
        <Table.Column title="Email" dataIndex="email" key="email" />
        <Table.Column title="Role" dataIndex="role" key="role" />
        <Table.Column
          title="Actions"
          key="actions"
          render={(_, user: User) => (
            <div className="space-x-2">
              <Button type="link" onClick={() => openModal(user)}><LiaEdit size={23} /></Button>
              <Popconfirm
                title="Are you sure to delete this user?"
                onConfirm={() => deleteUser(user.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" danger>
                  <RiDeleteBin3Line size={20} />
                </Button>
              </Popconfirm>
              <Button type="link" onClick={() => navigate(`/timetable/${user.id}`)}><GrSchedules size={20} /></Button>
            </div>
          )}
        />
      </Table>

      {/* Add/Edit Modal */}
      <Modal
        title={isEditMode ? "Edit User" : "Add User"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Please enter name" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please enter email" }]}>
            <Input type="email" />
          </Form.Item>

          {!isEditMode && (
            <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please enter password" }]}>
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item name="role" label="Role" rules={[{ required: true, message: "Select a role" }]}>
            <Select placeholder="Select role">
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
              <Option value="teacher">Teacher</Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">{isEditMode ? "Update" : "Create"}</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserPage;
