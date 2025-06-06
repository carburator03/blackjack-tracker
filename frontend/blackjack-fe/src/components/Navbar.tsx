import { useEffect, useState } from 'react';
import { getLoggedInUsername, getWallet } from '../services/auth';

interface NavbarProps {
  walletRefresh?: boolean;
}

const Navbar = ({ walletRefresh }: NavbarProps) => {
  const [username, setUsername] = useState<string | null>(null);
  const [wallet, setWallet] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const [fetchedUsername, fetchedWallet] = await Promise.all([
            getLoggedInUsername(),
            getWallet(),
          ]);
          setUsername(fetchedUsername);
          setWallet(fetchedWallet);
        }
      } catch (error) {
        console.error('Error fetching data:', (error as Error).message);
      }
    }

    fetchData();
  }, [walletRefresh]);

  const getWalletColor = () => {
    if (wallet === null) return 'text-white';
    if (wallet < 0) return 'text-error';
    if (wallet > 0) return 'text-success';
    return 'text-white';
  };

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between p-4 bg-neutral text-white'>
      <div className='flex items-center justify-center w-full sm:justify-start sm:w-auto mb-4 sm:mb-0'>
        <div
          className='text-lg font-bold cursor-pointer'
          onClick={() => (window.location.href = '/')}
        >
          Blackjack-Tracker
        </div>
      </div>
      {username && (
        <div className='flex flex-col w-full sm:flex-row sm:items-center sm:justify-end sm:w-auto'>
          <div className='flex flex-row items-center justify-between w-full sm:w-auto'>
            <div className={`font-bold ${getWalletColor()} sm:mr-4 w-24`}>
              Wallet: <br /> {wallet?.toLocaleString()} Ft
            </div>
            <div className='flex items-center sm:ml-4'>
              <div className='avatar placeholder hidden lg:block'>
                <div className='bg-accent text-neutral-content w-12 rounded-full'>
                  <span className='font-bold'>{username[0].toUpperCase()}</span>
                </div>
              </div>
              <button
                className='btn btn-primary ml-5'
                onClick={() => (window.location.href = '/dashboard')}
              >
                Dashboard
              </button>
              <button
                className='btn btn-secondary ml-5'
                onClick={() => (window.location.href = '/logout')}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
