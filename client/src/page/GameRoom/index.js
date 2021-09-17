import { useState } from "react";
import { Button, Badge } from "react-bootstrap";
import { Person } from "react-bootstrap-icons";
import { Route, Switch, Link } from "react-router-dom";
import "./GameRoom.css";

const GameRoom = ({ username, items, player2Username, socket, result }) => {
  const [choice, setChoice] = useState("...");

  return (
    <>
      <Switch>
        <Route path="/innergame">
          <div className="gameRoom_wrapper">
            <div className="gameRoom_gameArea">
              <div className="gameRoom_playerBlock">
                {result ? (
                  <Link to="/joingame">
                    <Button
                      variant="success"
                      style={{ width: "100%", marginBottom: "20px" }}
                    >
                      Join game
                    </Button>
                  </Link>
                ) : null}
                <h3>{player2Username}</h3>
                <div className="gameRoom_buttonBlock">
                  {items.map((it) => (
                    <Button
                      key={it}
                      disabled
                      bg="primary"
                      className="gameRoom_tagsButton"
                      style={{ cursor: "default" }}
                    >
                      {it}
                    </Button>
                  ))}
                </div>
                <h5>Player two choice: </h5>
                <p>{result.length > 0 ? result : "..."}</p>
                <Winner
                  items={items}
                  playerOneMove={result}
                  playerTwoMove={choice}
                ></Winner>
              </div>
              <div className="gameRoom_playerBlock">
                {result ? (
                  <Link to="/newgame">
                    <Button
                      variant="success"
                      style={{ width: "100%", marginBottom: "20px" }}
                    >
                      New game
                    </Button>
                  </Link>
                ) : null}
                <h3>{username}</h3>
                <div className="gameRoom_buttonBlock">
                  {items.map((it) => (
                    <Button
                      key={it}
                      disabled={choice !== "..." && choice.length > 0}
                      bg="primary"
                      className="gameRoom_tagsButton"
                      onClick={() => {
                        setChoice(it);
                        socket.current.send(
                          JSON.stringify({
                            event: "move",
                            to: player2Username,
                            move: it,
                          })
                        );
                      }}
                    >
                      {it}
                    </Button>
                  ))}
                </div>
                <h5>Your choice: </h5>
                <p>{choice}</p>
                <Winner
                  items={items}
                  playerOneMove={choice}
                  playerTwoMove={result}
                ></Winner>
              </div>
            </div>
          </div>
        </Route>
        <Route pah="/mygame">
          <div className="gameRoom_wrapper">
            <div className="gameRoom_gameArea">
              <div className="gameRoom_playerBlock">
                {result ? (
                  <Link to="/joingame">
                    <Button
                      variant="success"
                      style={{ width: "100%", marginBottom: "20px" }}
                    >
                      Join game
                    </Button>
                  </Link>
                ) : null}
                <h3>{username}</h3>
                <div className="gameRoom_buttonBlock">
                  {items.map((it) => (
                    <Button
                      key={it}
                      bg="primary"
                      disabled={choice !== "..." && choice.length > 0}
                      className="gameRoom_tagsButton"
                      onClick={() => {
                        setChoice(it);
                        socket.current.send(
                          JSON.stringify({
                            event: "move",
                            to: player2Username,
                            move: it,
                          })
                        );
                      }}
                    >
                      {it}
                    </Button>
                  ))}
                </div>
                <h5>Your choice: </h5>
                <p>{choice}</p>
                <Winner
                  items={items}
                  playerOneMove={choice}
                  playerTwoMove={result}
                ></Winner>
              </div>
              <div className="gameRoom_playerBlock">
                {player2Username.length > 0 ? (
                  <>
                    {result ? (
                      <Link to="/newgame">
                        <Button
                          variant="success"
                          style={{ width: "100%", marginBottom: "20px" }}
                        >
                          New game
                        </Button>
                      </Link>
                    ) : null}
                    <h3>{player2Username}</h3>
                    <div className="gameRoom_buttonBlock">
                      {items.map((it) => (
                        <Button
                          disabled
                          key={it}
                          bg="primary"
                          className="gameRoom_tagsButton"
                          style={{ cursor: "default" }}
                        >
                          {it}
                        </Button>
                      ))}
                    </div>
                    <h5>Player two choice: </h5>
                    <p>{result.length > 0 ? result : "..."}</p>
                    <Winner
                      items={items}
                      playerOneMove={result}
                      playerTwoMove={choice}
                    ></Winner>
                  </>
                ) : (
                  <>
                    <p>Waiting for player</p>
                    <Person size={100}></Person>
                  </>
                )}
              </div>
            </div>
          </div>
        </Route>
      </Switch>
    </>
  );
};

const Winner = ({ items, playerOneMove, playerTwoMove }) => {
  const playerOneIndex = items.indexOf(playerOneMove);
  const playerTwoIndex = items.indexOf(playerTwoMove);

  if (playerOneIndex === -1 || playerTwoIndex === -1) return <p></p>;
  if (playerOneIndex === 0 && playerTwoIndex === items.length - 1)
    return <Badge bg="success">Your win</Badge>;
  if (playerTwoIndex === 0 && playerOneIndex === items.length - 1)
    return <Badge bg="danger">Your lose</Badge>;
  if (playerOneIndex > playerTwoIndex)
    return <Badge bg="success">Your win</Badge>;
  if (playerOneIndex === playerTwoIndex)
    return <Badge bg="secondary">Draw</Badge>;
  else return <Badge bg="danger">Your lose</Badge>;
};

export default GameRoom;
