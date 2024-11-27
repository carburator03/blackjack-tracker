import React, { useState } from 'react';
import GamesTable from './GamesTable';
import Navbar from './Navbar';
import AddNewModal from './AddNewModal';

const Dashboard = () => {
  const [refresh, setRefresh] = useState(false);

  const handleGameAdded = () => {
    setRefresh(!refresh);
  };

  return (
    <>
      <Navbar walletRefresh={refresh} />
      <AddNewModal onGameAdded={handleGameAdded} />
      <GamesTable refresh={refresh} />
    </>
  );
};

export default Dashboard;
