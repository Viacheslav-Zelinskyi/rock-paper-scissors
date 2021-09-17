import { useState } from "react";
import { Badge, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NewGame.css";

const NewGame = ({ socket, username, items, setItems }) => {
  const [gameMode, setGameMode] = useState(true);

  return (
    <>
      <div className="newgame_wrapper">
        <h1>New game</h1>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            if (
              e.target[3].value
                .split(" ")
                .every((item) => !items.includes(item))
            )
              setItems([...e.target[3].value.split(" "), ...items]);
            else {
              alert("It's duplicate");
            }
          }}
        >
          <Form.Label>
            Now you need to add items for game or choose default. <br />
            At least three elements, there must be an odd number
          </Form.Label>
          <div className="gameMode_checkbox_block">
            <Form.Check
              value={1}
              type="radio"
              name="gameMode"
              label="Default 3 items: rock - paper - scissors"
              onChange={(data) => {
                setGameMode(data.target.value);
                setItems(["rock", "paper", "scissors"]);
              }}
            />
            <Form.Check
              value={2}
              type="radio"
              name="gameMode"
              label="Default 5 items: rock - spock - paper - lizard - scissors"
              onChange={(data) => {
                setGameMode(data.target.value);
                setItems(["rock", "spok", "paper", "lizard", "scissors"]);
              }}
            />
            <Form.Check
              value={3}
              type="radio"
              name="gameMode"
              label="Custom: "
              onChange={(data) => {
                setGameMode(data.target.value);
                setItems([]);
              }}
            />
          </div>
          <Form.Group className="addItemForm">
            <Form.Control
              placeholder="Enter one item or many items"
              disabled={gameMode !== "3" || items.length > 11}
            ></Form.Control>
            <Button
              variant="success"
              type="submit"
              disabled={gameMode !== "3" || items.length > 11}
            >
              Add
            </Button>
            <Button
              variant="danger"
              disabled={gameMode !== "3" || items.length > 11}
              onClick={() => setItems([])}
            >
              Reset
            </Button>
          </Form.Group>
          <Link to={validateItems(items) ? "/newgame" : "/mygame"}>
            <Button
              style={{ width: "100%" }}
              variant="info"
              disabled={validateItems(items)}
              onClick={() =>
                socket.current.send(
                  JSON.stringify({
                    event: "newgame",
                    username: username,
                    items: items,
                  })
                )
              }
            >
              Create game
            </Button>
          </Link>
          or
          <Link to="/joingame">
            <Button style={{ width: "100%" }} variant="danger" disabled={false}>
              Join game
            </Button>
          </Link>
          <Form.Text>Strongest on the bottom of list</Form.Text>
        </Form>
        <div className="itemTags">
          {items.map((it) => (
            <Badge key={it} bg="warning" style={{ margin: "5px" }}>
              {it}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
};

const validateItems = (items) => {
  if (items.length < 3) {
    return true;
  } else if (items.length % 2 === 0) {
    return true;
  } else return false;
};

export default NewGame;
