import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import supabase from "../config/supabaseClient";
import DrawerComponent from "./DrawerComponent";
import MenuIcon from "@mui/icons-material/Menu";
import { 
  Box, Container, Typography, Grid, Card, CardContent, 
  TextField, Button, Select, MenuItem, InputLabel, FormControl,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip
} from "@mui/material";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import SearchIcon from '@mui/icons-material/Search';

function Bonus() {
  const location = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [totalBonus, setTotalBonus] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const toggleDrawer = (open) => setOpenDrawer(open);

  useEffect(() => {
    const fetchTransactions = async () => {
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (!loggedInUser) return;

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("username", loggedInUser)
        .single();

      if (userError || !userData) return;

      const { data: withdrawals, error: withdrawalsError } = await supabase
        .from("withdrawals")
        .select("created_at, id, amount, action")
        .eq("user_id", userData.id)
        .order("created_at", { ascending: false });

      if (!withdrawalsError) setTransactions(withdrawals);
    };

    fetchTransactions();
  }, []);

  const handleWithdraw = async () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      window.alert("Sila log masuk terlebih dahulu!");
      return;
    }

    if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      window.alert("Sila masukkan jumlah pengeluaran yang sah!");
      return;
    }

    const withdrawAmountNum = parseFloat(withdrawAmount);

    if (withdrawAmountNum < 50) {
      window.alert("Jumlah pengeluaran minimum adalah RM50!");
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, name, bank_name, bank_account, total_bonus")
      .eq("username", loggedInUser)
      .single();

    if (userError || !userData) {
      window.alert("Gagal mendapatkan maklumat pengguna!");
      return;
    }

    if (withdrawAmountNum > userData.total_bonus) {
      window.alert("Jumlah pengeluaran melebihi baki bonus anda!");
      return;
    }

    const { error: withdrawError } = await supabase
      .from("withdrawals")
      .insert([
        {
          user_id: userData.id,
          name: userData.name,
          bank_name: userData.bank_name,
          account_number: userData.bank_account,
          amount: withdrawAmountNum,
          action: "pending",
          created_at: new Date().toISOString(),
        },
      ]);

    if (withdrawError) {
      window.alert("Gagal menghantar permohonan pengeluaran!");
      return;
    }

    const newTotalBonus = userData.total_bonus - withdrawAmountNum;
    const { error: updateError } = await supabase
      .from("users")
      .update({ total_bonus: newTotalBonus })
      .eq("id", userData.id);

    if (updateError) {
      window.alert("Gagal mengemas kini baki bonus!");
      return;
    }

    setTotalBonus(newTotalBonus);
    window.alert("Permohonan pengeluaran berjaya dihantar!");
    setWithdrawAmount("");
  };

  useEffect(() => {
    const fetchBonus = async () => {
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (!loggedInUser) return;

      const { data, error } = await supabase
        .from("users")
        .select("total_bonus")
        .eq("username", loggedInUser)
        .single();

      if (!error && data) setTotalBonus(data.total_bonus);
    };

    fetchBonus();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Anda pasti ingin log keluar?")) {
      localStorage.removeItem("userSession");
      localStorage.removeItem("loggedInUser");
      window.location.href = "/login";
    }
  };

  const filteredTransactions = transactions.filter((txn) => {
    const searchString = search.toLowerCase();
    const dateStr = new Date(txn.created_at).toLocaleDateString("en-GB").toLowerCase();
    
    return (
      (dateStr.includes(searchString) || 
       txn.id?.toString().includes(searchString) || 
       txn.amount?.toString().includes(searchString) || 
       txn.action?.toLowerCase().includes(searchString)) &&
      (filter === "" || txn.action === filter)
    );
  });

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', pb: 10 }}>
      {/* Header / Navbar */}
      <header className="header" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderBottom: 'none' }}>
        <img src="/assets/Logo.png" className="logo" alt="Logo" />
        <MenuIcon
          className="hamburger"
          onClick={() => toggleDrawer(true)}
          style={{ fontSize: 30, cursor: 'pointer', display: 'none' }}
        />
        <nav className="navbar">
          <ul>
            <li><Link to="/home" className={location.pathname === "/home" ? "active" : ""}>Utama</Link></li>
            <li><Link to="/bonus" className={location.pathname === "/bonus" ? "active" : ""}>Bonus</Link></li>
            <li><Link to="/rangkaian" className={location.pathname === "/rangkaian" ? "active" : ""}>Rangkaian anda</Link></li>
            <li><Link to="/settings" className={location.pathname === "/settings" ? "active" : ""}>Tetapan</Link></li>
            <li><Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>Hubungi kami</Link></li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                <LogoutIcon />
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <DrawerComponent openDrawer={openDrawer} toggleDrawer={toggleDrawer} handleLogout={handleLogout} />

      <Container maxWidth="lg" sx={{ paddingTop: '100px' }}>
        
        <Typography variant="h4" fontWeight="800" color="#0f172a" gutterBottom sx={{ mb: 4 }}>
          Pengurusan Bonus
        </Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Total Bonus Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: '20px', 
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              color: 'white',
              boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)',
              height: '100%',
              display: 'flex',
              alignItems: 'center'
            }}>
              <CardContent sx={{ p: 4, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="600" sx={{ opacity: 0.9, mb: 1 }}>
                    Baki Bonus Semasa
                  </Typography>
                  <Typography variant="h3" fontWeight="800">
                    RM {parseFloat(totalBonus).toFixed(2)}
                  </Typography>
                </Box>
                <AccountBalanceWalletIcon sx={{ fontSize: 60, opacity: 0.8 }} />
              </CardContent>
            </Card>
          </Grid>

          {/* Withdraw Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="700" color="#0f172a" gutterBottom>
                  Permohonan Pengeluaran
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
                  Minimum pengeluaran adalah RM50.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField 
                    fullWidth
                    label="Jumlah Pengeluaran (RM)" 
                    variant="outlined" 
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1, color: '#64748b' }}>RM</Typography>
                    }}
                  />
                  <Button 
                    variant="contained" 
                    onClick={handleWithdraw}
                    startIcon={<RequestQuoteIcon />}
                    sx={{ 
                      backgroundColor: '#10b981', 
                      '&:hover': { backgroundColor: '#059669' },
                      px: 3,
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      minWidth: '150px'
                    }}
                  >
                    Keluarkan
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Cari transaksi..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: '#94a3b8', mr: 1 }} />
            }}
            sx={{ flexGrow: 1, backgroundColor: 'white', borderRadius: '8px' }}
          />
          <FormControl size="small" sx={{ minWidth: 200, backgroundColor: 'white', borderRadius: '8px' }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filter}
              label="Status"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="">Semua Status</MenuItem>
              <MenuItem value="completed">Selesai (Completed)</MenuItem>
              <MenuItem value="pending">Dalam Proses (Pending)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Transactions Table */}
        <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Tarikh</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>ID Transaksi</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Jumlah (RM)</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{new Date(txn.created_at).toLocaleDateString("en-GB")}</TableCell>
                    <TableCell sx={{ color: '#64748b', fontSize: '0.9rem' }}>{txn.id}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>RM {parseFloat(txn.amount).toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={txn.action === 'pending' ? 'Dalam Proses' : 'Selesai'} 
                        color={txn.action === 'pending' ? 'warning' : 'success'} 
                        size="small"
                        sx={{ fontWeight: '600' }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#64748b' }}>
                    Tiada transaksi dijumpai.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

      </Container>
    </Box>
  );
}

export default Bonus;
