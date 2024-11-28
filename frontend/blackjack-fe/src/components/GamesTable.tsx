import { useEffect, useState } from 'react';
import { getGames } from '../services/auth';
import { format, parseISO } from 'date-fns';

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

  const groupedGames = games.reduce((acc: any, game: any) => {
    const date = parseISO(game.createdAt);
    const month = format(date, 'yyyy-MM');
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(game);
    return acc;
  }, {});

  return (
    <div className='flex justify-center mt-10 px-4'>
      <div className='w-full sm:w-1/2'>
        {Object.keys(groupedGames).map(month => (
          <div key={month} className='mb-8'>
            <h2 className='text-xl font-bold mb-4'>
              {format(parseISO(month + '-01'), 'MMMM yyyy')}
            </h2>
            <div className='hidden md:block'>
              <table className='table table-zebra w-full'>
                <thead>
                  <tr className='text-base'>
                    <th>Date</th>
                    <th>Number #1</th>
                    <th>Number #2</th>
                    <th>Number #3</th>
                    <th>Number #4</th>
                    <th>Dealer</th>
                    <th>Prize</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedGames[month].map((game: any) => (
                    <tr key={game.id}>
                      <td>{format(parseISO(game.createdAt), 'yyyy.MM.dd')}</td>
                      <td>{game.number1}</td>
                      <td>{game.number2}</td>
                      <td>{game.number3}</td>
                      <td>{game.number4}</td>
                      <td>{game.dealer}</td>
                      <td className={`font-bold ${game.win ? 'text-success' : 'text-info'}`}>
                        {game.win ? '+' + game.prize : game.prize}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='block md:hidden'>
              {groupedGames[month].map((game: any) => (
                <div key={game.id} className='mb-4 p-4 border rounded-lg'>
                  <div className='mb-2'>
                    <span className='font-bold'>Date:</span>{' '}
                    {format(parseISO(game.createdAt), 'yyyy.MM.dd')}
                  </div>
                  <div className='mb-2'>
                    <span className='font-bold'>Number #1:</span> {game.number1}
                  </div>
                  <div className='mb-2'>
                    <span className='font-bold'>Number #2:</span> {game.number2}
                  </div>
                  <div className='mb-2'>
                    <span className='font-bold'>Number #3:</span> {game.number3}
                  </div>
                  <div className='mb-2'>
                    <span className='font-bold'>Number #4:</span> {game.number4}
                  </div>
                  <div className='mb-2'>
                    <span className='font-bold'>Dealer:</span> {game.dealer}
                  </div>
                  <div className={`font-bold ${game.win ? 'text-success' : 'text-info'}`}>
                    <span className='font-bold'>Prize:</span>{' '}
                    {game.win ? '+' + game.prize : game.prize}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesTable;
