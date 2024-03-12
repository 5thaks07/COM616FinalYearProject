import React from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";

import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      style={{ display: "flex", height: "100vh", overflow: "scroll initial" }}
    >
      <CDBSidebar textColor="#fff" backgroundColor="#333">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <Link
            to="/"
            className="text-decoration-none"
            style={{ color: "inherit" }}
          >
            Sidebar
          </Link>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <Link to="/user-profile">
              <CDBSidebarMenuItem icon="user">Profile</CDBSidebarMenuItem>
            </Link>
            <Link to="/">
              <CDBSidebarMenuItem icon="columns">
                 Home
              </CDBSidebarMenuItem>
            </Link>
            <Link to="/chat">
              <CDBSidebarMenuItem icon="comment-alt">
                 Chat
              </CDBSidebarMenuItem>
            </Link>
            <Link to="/saved-recipes">
              <CDBSidebarMenuItem icon="bookmark">
                 Saved Recipes
              </CDBSidebarMenuItem>
            </Link>
            <Link to="/upload">
              <CDBSidebarMenuItem icon="cloud-upload-alt">
                 Upload
              </CDBSidebarMenuItem>
            </Link>
          </CDBSidebarMenu>
        </CDBSidebarContent>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
