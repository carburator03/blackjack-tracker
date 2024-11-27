import { useState } from 'react';
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
      <div className='px-4'>
        <AddNewModal onGameAdded={handleGameAdded} />
        <GamesTable refresh={refresh} />
      </div>
    </>
  );
};

export default Dashboard;
