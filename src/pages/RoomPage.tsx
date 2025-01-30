import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Popconfirm,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RiCalendarScheduleLine, RiDeleteBin3Line } from "react-icons/ri";
import { LiaEdit } from "react-icons/lia";
import { SiGoogleclassroom } from "react-icons/si";
import { FiPlusCircle } from "react-icons/fi";


const { Option } = Select;

interface Building {
  id: number;
  name: string;
}

interface Room {
  id: number;
  name: string;
  floor: number;
  status: boolean;
  building_id: number;
  building: Building;
}

const RoomPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [form] = Form.useForm();


  // Fetch Rooms
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/rooms`);
      setRooms(response.data);
    } catch (error) {
      message.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Buildings for selection
  const fetchBuildings = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/buildings");
      setBuildings(response.data);
    } catch (error) {
      message.error("Failed to fetch buildings");
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchBuildings();
  }, []);

  // Handle Add/Edit Room
  const handleSubmit = async (values: any) => {
    try {
      if (isEditMode && selectedRoom) {
        await axios.patch(
          `http://localhost:8000/api/rooms/${selectedRoom.id}`,
          values
        );
        message.success("Room updated successfully!");
      } else {
        await axios.post("http://localhost:8000/api/rooms", {
          ...values,
          status: true,
        });
        message.success("Room created successfully!");
      }
      fetchRooms();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save room");
    }
  };

  // Open Modal for Add/Edit
  const openModal = (room?: Room) => {
    if (room) {
      setIsEditMode(true);
      setSelectedRoom(room);
      form.setFieldsValue(room);
    } else {
      setIsEditMode(false);
      setSelectedRoom(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Delete Room
  const deleteRoom = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/rooms/${id}`);
      message.success("Room deleted successfully!");
      fetchRooms();
    } catch (error) {
      message.error("Failed to delete room");
    }
  };

  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
      <SiGoogleclassroom size={30}/>
        <h1 className="text-2xl">Room Management</h1>
        </div>
        <Button type="primary" onClick={() => openModal()}>
          <FiPlusCircle />Add
        </Button>
      </div>

      <Table
        dataSource={rooms}
        rowKey="id"
        loading={loading}
        pagination={false}
      >
        <Table.Column title="Name" dataIndex="name" key="name" />
        <Table.Column title="Floor" dataIndex="floor" key="floor" />
        <Table.Column
          title="Status"
          dataIndex="status"
          key="status"
          render={(status) => (status ? "Active" : "Inactive")}
        />
        <Table.Column
          title="Building"
          dataIndex={["building", "name"]}
          key="building"
        />
        <Table.Column
          title="Actions"
          key="actions"
          render={(_, room: Room) => (
            <div className="space-x-2 items-center">
              <Button type="link" onClick={() => openModal(room)}>
                <LiaEdit size={23} />
              </Button>
              <Button
                type="link"
                onClick={() => navigate(`/assign/${room.id}`)}
              >
                <RiCalendarScheduleLine size={20} />
              </Button>

              <Popconfirm
                title="Are you sure to delete this room?"
                onConfirm={() => deleteRoom(room.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" danger>
                  <RiDeleteBin3Line size={20} />
                </Button>
              </Popconfirm>
            </div>
          )}
        />
      </Table>

      {/* Add/Edit Modal */}
      <Modal
        title={isEditMode ? "Edit Room" : "Add Room"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Room Name"
            rules={[{ required: true, message: "Please enter room name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="floor" label="Floor">
            <Input type="number" />
          </Form.Item>

          {isEditMode && (
            <Form.Item name="status" label="Status" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          )}

          <Form.Item
            name="building_id"
            label="Building"
            rules={[{ required: true, message: "Select a building" }]}
          >
            <Select placeholder="Select a building">
              {buildings.map((building) => (
                <Option key={building.id} value={building.id}>
                  {building.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomPage;
