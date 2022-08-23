import React, { useState } from 'react';
import Editor from '../components/Editor';
import User from '../components/User';

const EditorPage = () => {
  const [users, setUsers] = useState([
    { socketId: 1, username: 'Amaresh' },
    { socketId: 2, username: 'Barik' },
  ]);
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
            {users.map((user) => (
              <User username={user.username} key={user.socketId} />
            ))}
          </div>
        </div>
        <button className='btn copyBtn'>Copy ROOM ID</button>
        <button className='btn leaveBtn'>Leave</button>
      </div>
      <div className="editorRightBox">
          <Editor/>
      </div>
    </div>
  );
};

export default EditorPage;
