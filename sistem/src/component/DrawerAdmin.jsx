import React from "react";
import { List, ListItem, ListItemText, Drawer } from "@mui/material";

function DrawerAdmin({ openDrawer, toggleDrawer, handleLogout }) {
  return (
    <div>
      {/* Drawer for Small Screens */}
      <Drawer anchor="left" open={openDrawer} onClose={() => toggleDrawer(false)}>
        <List style={{ width: 250 }}>
          <ListItem button onClick={() => { window.location.href = "/total"; toggleDrawer(false); }}>
            <ListItemText primary="Jumlah Pengguna" />
          </ListItem>
          <ListItem button onClick={() => { window.location.href = "/pin"; toggleDrawer(false); }}>
            <ListItemText primary="Jana pin" />
          </ListItem>
          <ListItem button onClick={() => { window.location.href = "/inquiry"; toggleDrawer(false); }}>
            <ListItemText primary="Permintaan pengeluaran " />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Log Keluar" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default DrawerAdmin;
