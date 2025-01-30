import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Layout, Menu, Modal, theme } from "antd";
import logoImage from "./assets/images/logo.png";
import { RxDashboard } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import { RiBuilding4Line } from "react-icons/ri";
import { SiGoogleclassroom } from "react-icons/si";
import { LuBookType, LuUsers } from "react-icons/lu";
import BuildingPage from "./pages/BuildingPage";
import RoomPage from "./pages/RoomPage";
import UserPage from "./pages/UserPage";
import AssignPage from "./pages/AssignPage";
import CoursePage from "./pages/CoursePage";
import TimetablePage from "./pages/TimetablePage";

const { Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  // 🔄 Use useLocation to get the current URL path
  const location = useLocation();

  // 🗂 Define the menu items
  const items = [
    {
      key: "/",
      icon: <RxDashboard />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: "/building",
      icon: <RiBuilding4Line />,
      label: <Link to="/building">Building</Link>,
    },
    {
      key: "/room",
      icon: <SiGoogleclassroom />,
      label: <Link to="/room">Room</Link>,
    },
    {
      key: "/course",
      icon: <LuBookType />,
      label: <Link to="/course">Course</Link>,
    },
    {
      key: "/user",
      icon: <LuUsers />,
      label: <Link to="/user">User</Link>,
    },
  ];

  const handleLogout = () => {
    Modal.confirm({
      title: "Logout",
      icon: <ExclamationCircleOutlined />,
      content: "តើអ្នកចង់ចាក់ចេញពីប្រព័ន្ធមែនទេ?",
      okText: "Logout",
      cancelText: "ទេ",
      onOk: async () => {
        window.localStorage.clear();
        window.location.href = "/login";
      },
    });
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider theme="light" trigger={null} collapsible collapsed={collapsed}>
        <div
          onClick={() => setCollapsed(!collapsed)}
          className="w-full h-12 flex justify-center items-center my-4 cursor-pointer"
        >
          <img className="w-14" src={logoImage} alt="logo" />
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
        />
        <div className="absolute bottom-0 w-full p-3 flex justify-center items-center">
          <div
            onClick={() => handleLogout()}
            className="cursor-pointer flex items-center rounded-md gap-1 hover:bg-slate-400 p-1"
          >
            <FiLogOut /> Logout
          </div>
        </div>
      </Sider>

      <Layout>
        <Content
          style={{
            margin: "24px 16px",
            padding: 10,
            minHeight: 280,
            borderRadius: borderRadiusLG,
            height: "calc(100vh - 120px)",
            overflow: "auto",
            backgroundColor: "#fff",
          }}
        >
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/building" element={<BuildingPage />} />
            <Route path="/room" element={<RoomPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/assign/:id" element={<AssignPage />} />
            <Route path="/timetable/:id" element={<TimetablePage />} />
            <Route path="/course" element={<CoursePage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

const AppWrapper: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("authToken");

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <Route path="/login" element={<LoginPage />} />
        ) : (
          <>
            <Route path="/*" element={<App />} />
          </>
        )}
        {!isAuthenticated && (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
};

export default AppWrapper;
