import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  let navigate = useNavigate();
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success('A new room is created');
    navigate(`/editor/${id}`, {
      state: {
        username,
      },
    });
    //     console.log('id: ', id);
  };
  return (
    <div className="HomePageBox">
      <div className="formBox">
        <img
          className="homepage-logo"
          src="/assets/app-logo1.png"
          alt="app-logo"
        />
        <h4 className="formLabel">Paste invitation ROOM ID</h4>
        <div className="inputGroup">
          <input
            className="inputField"
            type="text"
            placeholder="ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <input
            className="inputField"
            type="text"
            placeholder="USERNAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="btn joinBtn">Join</button>
          <span className="createInfo">
            {' '}
            If you don't have an invite then create &nbsp;
            <span
              onClick={(e) => createNewRoom(e)}
              href="/"
              className="createNewRoom"
            >
              new room
            </span>{' '}
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Build with Love By{' '}
          <a href="https://github.com/amareshcoding/">Amaresh</a>
        </h4>
      </footer>
    </div>
  );
};

export default Home;
