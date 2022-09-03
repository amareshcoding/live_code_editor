import React, { useEffect, useRef, useState } from 'react';
import ACTIONS from '../actions';
import Editor from '../components/Editor';
import User from '../components/User';
import { initSocket } from '../socket';
import {
  useLocation,
  useParams,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import toast from 'react-hot-toast';

const EditorPage = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClints] = useState([]);
  //
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connected railed, try again later.');
        reactNavigator('/');
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      //Listening for joined client
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClints(clients);
        }
      );
      //Disconnected Listening
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        //
        toast.success(`${username} left the room.`);
        setClints((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  if (!location.state) {
    return <Navigate to={'/'} />;
  }
  return (
    <div className="editorContainer">
      <div className="editorLeftBox">
        <div className="leftInnerBox">
          <div className="logoBox">
            <img
              className="editorLogo"
              src="/assets/app-logo1.png"
              alt="logo-img"
            />
          </div>
          <h3>Connected</h3>
          <div className="userList">
            {clients.map((client) => (
              <User username={client.username} key={client.socketId} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn">Copy ROOM ID</button>
        <button className="btn leaveBtn">Leave</button>
      </div>
      <div className="editorRightBox">
        <Editor />
      </div>
    </div>
  );
};

export default EditorPage;
