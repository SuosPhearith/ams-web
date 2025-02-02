import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Popconfirm } from "antd";
import axios from "axios";
import { RiBuilding4Line, RiDeleteBin3Line } from "react-icons/ri";
import { FiPlusCircle } from "react-icons/fi";
import { LiaEdit } from "react-icons/lia";
import { LuBookType } from "react-icons/lu";

interface Course {
  id: number;
  name: string;
  code: string;
  description?: string;
}

const CoursePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();

  // Fetch Courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/courses");
      setCourses(response.data.data);
    } catch (error) {
      message.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle Submit (Create or Update)
  const handleSubmit = async (values: any) => {
    try {
      if (isEditMode && selectedCourse) {
        await axios.patch(`http://localhost:8000/api/courses/${selectedCourse.id}`, values);
        message.success("Course updated successfully!");
      } else {
        await axios.post("http://localhost:8000/api/courses", values);
        message.success("Course created successfully!");
      }
      fetchCourses();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save course");
    }
  };

  // Open Modal for Add/Edit
  const openModal = (course?: Course) => {
    if (course) {
      setIsEditMode(true);
      setSelectedCourse(course);
      form.setFieldsValue(course);
    } else {
      setIsEditMode(false);
      setSelectedCourse(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Delete Course
  const deleteCourse = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/courses/${id}`);
      message.success("Course deleted successfully!");
      fetchCourses();
    } catch (error) {
      message.error("Failed to delete course");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <LuBookType size={30} />
          <h1 className="text-2xl">Course Management</h1>
        </div>
        <Button type="primary" onClick={() => openModal()}><FiPlusCircle />Add</Button>
      </div>

      <Table dataSource={courses} rowKey="id" loading={loading} pagination={false}>
        <Table.Column title="Course Name" dataIndex="name" key="name" />
        <Table.Column title="Code" dataIndex="code" key="code" />
        <Table.Column title="Description" dataIndex="description" key="description" />
        <Table.Column
          title="Actions"
          key="actions"
          render={(_, course: Course) => (
            <div className="space-x-2">
              <Button type="link" onClick={() => openModal(course)}><LiaEdit size={23} /></Button>
              <Popconfirm
                title="Are you sure to delete this course?"
                onConfirm={() => deleteCourse(course.id)}
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
        title={isEditMode ? "Edit Course" : "Add Course"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Course Name" rules={[{ required: true, message: "Please enter course name" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="code" label="Course Code" >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea />
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

export default CoursePage;
