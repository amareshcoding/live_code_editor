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
  const codeRef = useRef(null);
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
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
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
  const copyRoomID = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID has been copied to your clicpboard.');
    } catch (e) {
      toast.error('unable to copy room ID');
      console.error('e: ', e);
    }
  };
  const leaveMeetingRoom = () => {
    //
    reactNavigator('/');
  };

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
        <button onClick={copyRoomID} className="btn copyBtn">
          Copy ROOM ID
        </button>
        <button onClick={leaveMeetingRoom} className="btn leaveBtn">
          Leave
        </button>
      </div>
      <div className="editorRightBox">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
