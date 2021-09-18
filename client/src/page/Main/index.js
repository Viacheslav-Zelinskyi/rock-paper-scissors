import Button from "react-bootstrap/Button";
import { ButtonGroup, Form } from "react-bootstrap";

import "./MainPage.css";
import { Link } from "react-router-dom";

const MainPage = ({ setUsername, username, socket }) => {
  return (
    <div className="main_wrapper">
      <h1>Your name</h1>
      <Form.Group className="form_wrapper">
        <Form.Control
          className="form_input"
          type="text"
          placeholder="Enter your nickname"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        ></Form.Control>
        <ButtonGroup className="form_button-group">
          <Link to={username ? "/newgame" : ""}>
            <Button
              disabled={!username}
              onClick={() => sendUsername(socket, username)}
            >
              Create new game
            </Button>
          </Link>
          <Link to={username ? "/joingame" : ""}>
            <Button
            style={{width: "80px"}}
              disabled={!username}
              variant="success"
              onClick={() => sendUsername(socket, username)}
            >
              Join
            </Button>
          </Link>
        </ButtonGroup>
      </Form.Group>
    </div>
  );
};

const sendUsername = (socket, username) => {
  socket.current.send(
    JSON.stringify({ event: "setusername", username: username })
  );
};

export default MainPage;
