import React, { useState, useEffect } from "react";
import { Table, Modal, Form, Input, Button, message, Popconfirm } from "antd";
import axios from "axios";

interface Building {
  id: number;
  name: string;
  code: string;
  floor: number;
  status?: string;
  created_by?: number;
}

const BuildingPage: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:8000/api/buildings");
      setBuildings(data);
    } catch (error) {
      message.error("Failed to load buildings.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/buildings/${id}`);
      message.success("Building deleted successfully");
      setBuildings(buildings.filter((building) => building.id !== id));
    } catch (error) {
      message.error("Failed to delete building.");
    }
  };

  const handleAddOrUpdate = async (values: any) => {
    try {
      if (editingBuilding) {
        await axios.patch(`http://localhost:8000/api/buildings/${editingBuilding.id}`, values);
        message.success("Building updated successfully");
      } else {
        const { data } = await axios.post("http://localhost:8000/api/buildings", values);
        setBuildings([...buildings, data.building]);
        message.success("Building created successfully");
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchBuildings();
    } catch (error) {
      message.error("Failed to save building.");
    }
  };

  const showModal = (building?: Building) => {
    setEditingBuilding(building || null);
    setIsModalVisible(true);
    if (building) {
      form.setFieldsValue(building);
    } else {
      form.resetFields();
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Code", dataIndex: "code", key: "code" },
    { title: "Floor", dataIndex: "floor", key: "floor" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Building) => (
        <div className="flex gap-2">
          <Button type="link" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this building?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 mx-auto shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold mb-4">Building Management</h1>
      <Button type="primary" onClick={() => showModal()} className="mb-4">
        Add Building
      </Button>
      </div>
      <Table className="w-full" columns={columns} dataSource={buildings} rowKey="id" loading={loading} pagination={false}/>

      {/* Add / Edit Modal */}
      <Modal
        title={editingBuilding ? "Edit Building" : "Add Building"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrUpdate}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter the name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="Code" rules={[{ required: true, message: "Please enter the code" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="floor" label="Floor" >
            <Input type="number" />
          </Form.Item>
          <div className="flex justify-end">
            <Button onClick={() => setIsModalVisible(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingBuilding ? "Update" : "Add"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default BuildingPage;
