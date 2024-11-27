import React, { useState } from 'react';
import { addGame, getCurrentUser } from '../services/auth';

interface GameGroup {
  number1: string;
  number2: string;
  number3: string;
  number4: string;
  dealer: string;
  prize: string;
}

const emptyGroup = {
  number1: '',
  number2: '',
  number3: '',
  number4: '',
  dealer: '',
  prize: '',
};

const AddNewModal = ({ onGameAdded }: { onGameAdded: () => void }) => {
  const [ticketPrice, setTicketPrice] = useState('300');
  const [errorMessage, setErrorMessage] = useState('');
  const [gameGroups, setGameGroups] = useState<GameGroup[]>([{ ...emptyGroup }]);

  const handleTicketPriceChange = (price: string) => {
    setTicketPrice(price);
    if (price === '500') {
      setGameGroups([{ ...emptyGroup }, { ...emptyGroup }, { ...emptyGroup }, { ...emptyGroup }]);
    } else {
      setGameGroups([{ ...emptyGroup }]);
    }
  };

  const handleInputChange = (index: number, field: keyof GameGroup, value: string) => {
    const updatedGroups = [...gameGroups];
    updatedGroups[index] = { ...updatedGroups[index], [field]: value };
    setGameGroups(updatedGroups);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = getCurrentUser();
    if (!username) {
      console.error('User not logged in');
      return;
    }

    try {
      await addGame(gameGroups);
      onGameAdded();
      setGameGroups(ticketPrice === '500' ? Array(4).fill({ ...emptyGroup }) : [{ ...emptyGroup }]);

      const modal = document.getElementById('my_modal_5') as HTMLDialogElement;
      if (modal) {
        modal.close();
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setErrorMessage(err.response.data.detail);
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    }
  };

  return (
    <>
      <div className='flex justify-center mt-10'>
        <button
          className='btn btn-primary font-bold text-base'
          onClick={() => {
            const modal = document.getElementById('my_modal_5') as HTMLDialogElement;
            if (modal) {
              modal.showModal();
            }
          }}
        >
          Add new ticket
        </button>
      </div>
      <dialog id='my_modal_5' className='modal modal-top sm:modal-middle'>
        <div className='modal-box bg-gray-100'>
          <h3 className='font-bold text-lg'>Add a new ticket</h3>
          {errorMessage && <p className='text-error text-l mb-4'>{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className='py-4'>
              <label className='block text-sm font-bold mb-2'>Price of the ticket:</label>
              <div className='flex items-center mb-4'>
                <label className='flex items-center mr-4'>
                  <input
                    type='radio'
                    name='ticketPrice'
                    value='300'
                    checked={ticketPrice === '300'}
                    onChange={e => handleTicketPriceChange(e.target.value)}
                    className='radio radio-primary bg-gray-100'
                  />
                  <span className='ml-2'>300 Ft</span>
                </label>
                <label className='flex items-center'>
                  <input
                    type='radio'
                    name='ticketPrice'
                    value='500'
                    checked={ticketPrice === '500'}
                    onChange={e => handleTicketPriceChange(e.target.value)}
                    className='radio radio-primary bg-gray-100'
                  />
                  <span className='ml-2'>500 Ft</span>
                </label>
              </div>

              {gameGroups.map((group, index) => (
                <div key={index} className='mb-8 p-4 border rounded-lg'>
                  <h4 className='font-bold mb-4'>Game {index + 1}</h4>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-bold mb-2'>Number 1:</label>
                      <input
                        type='number'
                        className='input input-bordered w-full bg-gray-100'
                        value={group.number1}
                        onChange={e => handleInputChange(index, 'number1', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-bold mb-2'>Number 2:</label>
                      <input
                        type='number'
                        className='input input-bordered w-full bg-gray-100'
                        value={group.number2}
                        onChange={e => handleInputChange(index, 'number2', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-bold mb-2'>Number 3:</label>
                      <input
                        type='number'
                        className='input input-bordered w-full bg-gray-100'
                        value={group.number3}
                        onChange={e => handleInputChange(index, 'number3', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-bold mb-2'>Number 4:</label>
                      <input
                        type='number'
                        className='input input-bordered w-full bg-gray-100'
                        value={group.number4}
                        onChange={e => handleInputChange(index, 'number4', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-bold mb-2'>Dealer:</label>
                      <input
                        type='number'
                        className='input input-bordered w-full bg-gray-100'
                        value={group.dealer}
                        onChange={e => handleInputChange(index, 'dealer', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-bold mb-2'>Prize:</label>
                      <input
                        type='number'
                        className='input input-bordered w-full bg-gray-100'
                        value={group.prize}
                        onChange={e => handleInputChange(index, 'prize', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className='modal-action'>
              <button
                type='button'
                className='btn'
                onClick={() => {
                  const modal = document.getElementById('my_modal_5') as HTMLDialogElement;
                  if (modal) {
                    modal.close();
                  }
                }}
              >
                Close
              </button>
              <button type='submit' className='btn btn-primary'>
                Submit
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default AddNewModal;
