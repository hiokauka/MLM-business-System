import React from "react";
import { List, ListItem, ListItemText, Drawer } from "@mui/material";

function DrawerComponent({ openDrawer, toggleDrawer, handleLogout }) {
  return (
    <div>
      {/* Drawer for Small Screens */}
      <Drawer anchor="left" open={openDrawer} onClose={() => toggleDrawer(false)}>
        <List style={{ width: 250 }}>
          <ListItem button onClick={() => { window.location.href = "/home"; toggleDrawer(false); }}>
            <ListItemText primary="Utama" />
          </ListItem>
          <ListItem button onClick={() => { window.location.href = "/bonus"; toggleDrawer(false); }}>
            <ListItemText primary="Bonus" />
          </ListItem>
          <ListItem button onClick={() => { window.location.href = "/rangkaian"; toggleDrawer(false); }}>
            <ListItemText primary="Rangkaian Anda" />
          </ListItem>
          <ListItem button onClick={() => { window.location.href = "/contact"; toggleDrawer(false); }}>
            <ListItemText primary="Hubungi Kami" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Log Keluar" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default DrawerComponent;
