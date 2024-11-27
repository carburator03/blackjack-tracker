import React, { useEffect, useState } from 'react';
import { getGames } from '../services/auth';

const GamesTable = ({ refresh }: { refresh: boolean }) => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    async function fetchGames() {
      try {
        const data = await getGames();
        setGames(data);
      } catch (error) {
        console.error('Error fetching games:', (error as Error).message);
      }
    }

    fetchGames();
  }, [refresh]);

  return (
    <div className='flex justify-center mt-10'>
      <table className='table table-zebra w-1/2'>
        <thead>
          <tr className='text-base'>
            <th>Number #1</th>
            <th>Number #2</th>
            <th>Number #3</th>
            <th>Number #4</th>
            <th>Dealer</th>
            <th>Prize</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game: any) => (
            <tr key={game.id}>
              <td>{game.number1}</td>
              <td>{game.number2}</td>
              <td>{game.number3}</td>
              <td>{game.number4}</td>
              <td>{game.dealer}</td>
              <td className={`font-bold ${game.win ? 'text-green-600' : 'text-red-600'}`}>
                {game.win ? '+' + game.prize : '-' + game.prize}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GamesTable;
