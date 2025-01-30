/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Select, message, Popconfirm } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CgAssign } from "react-icons/cg";
import { FiPlusCircle } from "react-icons/fi";
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBin3Line } from "react-icons/ri";

const { Option } = Select;

interface Room {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
}

interface Course {
  id: number;
  name: string;
}

interface Schedule {
  id: number;
  room_id: number;
  day: string;
  time_7_9_am?: User;
  time_7_9_am_course?: Course;
  time_9_11_am?: User;
  time_9_11_am_course?: Course;
  time_1_3_pm?: User;
  time_1_3_pm_course?: Course;
  time_3_5_pm?: User;
  time_3_5_pm_course?: Course;
  room: Room;
}

const AssignPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  const { id } = useParams(); // Get room_id from URL

  // Fetch schedules for the selected room
  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/schedules/${id}`
      );
      setSchedules(response.data.data);
    } catch (error) {
      message.error("Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users (teachers)
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/users");
      setUsers(response.data.data);
    } catch (error) {
      message.error("Failed to fetch users");
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/courses");
      setCourses(response.data.data);
    } catch (error) {
      message.error("Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchUsers();
    fetchCourses();
  }, []);

  // Handle submit (create or update schedule)
  const handleSubmit = async (values: any) => {
    try {
      if (isEditMode && selectedSchedule) {
        await axios.patch(
          `http://localhost:8000/api/schedules/${selectedSchedule.id}`,
          {
            ...values,
            room_id: id,
          }
        );
        message.success("Schedule updated successfully!");
      } else {
        console.log("values");
        console.log(values);
        await axios.post("http://localhost:8000/api/schedules", {
          ...values,
          room_id: id,
        });
        message.success("Schedule assigned successfully!");
      }
      fetchSchedules();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to assign schedule");
    }
  };

  // Open modal for adding/editing schedule
  const openModal = (schedule?: Schedule) => {
    if (schedule) {
      setIsEditMode(true);
      setSelectedSchedule(schedule);
      form.setFieldsValue(schedule);
    } else {
      setIsEditMode(false);
      setSelectedSchedule(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Delete a schedule
  const deleteSchedule = async (scheduleId: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/schedules/${scheduleId}`);
      message.success("Schedule deleted successfully!");
      fetchSchedules();
    } catch (error) {
      message.error("Failed to delete schedule");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <CgAssign size={30} />
          <h1 className="text-xl font-semibold">Assign Schedules</h1>
        </div>
        <Button type="primary" onClick={() => openModal()}>
          <FiPlusCircle size={20} />Schedule
        </Button>
      </div>

      <Table
        dataSource={schedules}
        rowKey="id"
        loading={loading}
        pagination={false}
      >
        <Table.Column title="Room" dataIndex={["room", "name"]} key="room" />
        <Table.Column title="Day" dataIndex="day" key="day" />

        <Table.Column
          title="7-9 AM"
          key="time_7_9_am"
          render={(schedule) => (
            <div className="flex flex-col items-center">
              <div className="text-sm text-blue-600">
                {schedule.time7_9_am_course?.name || "-"}
              </div>
              <div>{schedule.time7_9_am_teacher?.name || "-"}</div>
            </div>
          )}
        />

        <Table.Column
          title="9-11 AM"
          key="time_9_11_am"
          render={(schedule) => (
            <div className="flex flex-col items-center">
              <div className="text-sm text-blue-600">
                {schedule.time9_11_am_course?.name || "-"}
              </div>
              <div>{schedule.time9_11_am_teacher?.name || "-"}</div>
            </div>
          )}
        />

        <Table.Column
          title="1-3 PM"
          key="time_1_3_pm"
          render={(schedule) => (
            <div className="flex flex-col items-center">
              <div className="text-sm text-blue-600">
                {schedule.time1_3_pm_course?.name || "-"}
              </div>
              <div>{schedule.time1_3_pm_teacher?.name || "-"}</div>
            </div>
          )}
        />

        <Table.Column
          title="3-5 PM"
          key="time_3_5_pm"
          render={(schedule) => (
            <div className="flex flex-col items-center">
              <div className="text-sm text-blue-600">
                {schedule.time3_5_pm_course?.name || "-"}
              </div>
              <div>{schedule.time3_5_pm_teacher?.name || "-"}</div>
            </div>
          )}
        />

        <Table.Column
          title="Actions"
          key="actions"
          render={(_, schedule: Schedule) => (
            <div className="space-x-2">
              <Button type="link" onClick={() => openModal(schedule)}>
                <LiaEdit size={23} />
              </Button>
              <Popconfirm
                title="Are you sure to delete this schedule?"
                onConfirm={() => deleteSchedule(schedule.id)}
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

      {/* Assign/Edit Modal */}
      <Modal
        title={isEditMode ? "Edit Schedule" : "Assign Schedule"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="day"
            label="Day"
            rules={[{ required: true, message: "Select a day" }]}
          >
            <Select placeholder="Select day">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <Option key={day} value={day}>
                  {day}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {["time_7_9_am", "time_9_11_am", "time_1_3_pm", "time_3_5_pm"].map(
            (timeSlot) => (
              <>
                <Form.Item name={timeSlot} label={`${timeSlot} Teacher`}>
                  <Select placeholder="Select teacher" allowClear>
                    {users.map((user) => (
                      <Option key={user.id} value={user.id}>
                        {user.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name={`${timeSlot}_course`}
                  label={`${timeSlot} Course`}
                >
                  <Select placeholder="Select course" allowClear>
                    {courses.map((course) => (
                      <Option key={course.id} value={course.id}>
                        {course.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            )
          )}

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "Update" : "Assign"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AssignPage;
