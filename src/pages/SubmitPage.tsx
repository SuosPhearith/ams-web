import React, { useState, useEffect } from "react";
import { Table, Button, DatePicker, Select, Form, message } from "antd";
import axios from "axios";
import { RiContactsBook3Line } from "react-icons/ri";

const { RangePicker } = DatePicker;
const { Option } = Select;

const SubmitPage: React.FC = () => {
  const [submits, setSubmits] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    userId: null,
    startDate: null,
    endDate: null,
  });

  // Fetch users for the filter
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/users");
      setUsers(response.data.data);
    } catch (error) {
      message.error("Failed to fetch users");
    }
  };

  // Fetch submits
  const fetchSubmits = async (params = {}) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/submits", {
        params: {
          page: pagination.current,
          user_id: filters.userId,
          start_date: filters.startDate,
          end_date: filters.endDate,
          ...params,
        },
      });

      setSubmits(response.data.data);
      setPagination({
        ...pagination,
        current: response.data.current_page,
        total: response.data.total,
      });
    } catch (error) {
      message.error("Failed to fetch submits");
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (changedFilters: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...changedFilters,
    }));
  };

  // Handle table change
  const handleTableChange = (pagination: any) => {
    setPagination({
      ...pagination,
    });
    fetchSubmits({
      page: pagination.current,
    });
  };

  // Handle filter submission
  const handleFilterSubmit = () => {
    fetchSubmits({ page: 1 });
  };

  useEffect(() => {
    fetchUsers();
    fetchSubmits();
  }, []);

  return (
    <div className="p-6">
      <div className="flex iterms-center gap-2">
      <RiContactsBook3Line size={30} />
      <h1 className="text-2xl">Submit Managerment</h1>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded mb-6">
        <Form layout="inline" onFinish={handleFilterSubmit}>
          <Form.Item label="User">
            <Select
              placeholder="Select user"
              className="min-w-[200px]"
              allowClear
              onChange={(value) =>
                handleFilterChange({ userId: value || null })
              }
            >
              {users.map((user: any) => (
                <Option key={user.id} value={user.id}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Date Range">
            <RangePicker
              onChange={(dates, dateStrings) =>
                handleFilterChange({
                  startDate: dateStrings[0] || null,
                  endDate: dateStrings[1] || null,
                })
              }
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Apply Filters
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Submits Table */}
      <Table
        dataSource={submits}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: false,
        }}
        onChange={handleTableChange}
        className="bg-white rounded"
      >
        <Table.Column title="ID" dataIndex="id" key="id" />
        <Table.Column
          title="Building"
          key="building"
          render={(value) => <div>{value?.room?.building?.name}</div>}
        />
        <Table.Column
          title="Room"
          key="room"
          render={(value) => <div>{value?.room?.name}</div>}
        />
        <Table.Column title="User" key="user_id" render={(value) => (<div>{value?.user?.name}</div>)}/>
        <Table.Column
          title="Submitted Date"
          dataIndex="submitted_date"
          key="submitted_date"
        />
        <Table.Column title="Type" dataIndex="type" key="type" />
        <Table.Column title="Note" dataIndex="note" key="note" />
      </Table>
    </div>
  );
};

export default SubmitPage;
