import { useState } from "react";
import { Button, Badge, Accordion } from "react-bootstrap";
import { Person } from "react-bootstrap-icons";
import { Route, Switch } from "react-router-dom";
import "./GameRoom.css";

const GameRoom = ({ username, items, player2Username, socket, result }) => {
  const [choice, setChoice] = useState("...");

  return (
    <>
      <Switch>
        <Route path="/innergame">
          <div className="gameRoom_wrapper">
            <div className="gameRoom_gameArea">
              <div className="gameRoom_players">
                <div className="gameRoom_playerBlock">
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
                  <h5>Player two: </h5>
                  <p>{result.length > 0 ? result : "..."}</p>
                  <Winner
                    items={items}
                    playerOneMove={result}
                    playerTwoMove={choice}
                  ></Winner>
                </div>
                <div className="gameRoom_playerBlock">
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
              <Button variant="danger" onClick={() => window.location.reload()}>
                Close
              </Button>
              <Accordion className="helpBar">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Help</Accordion.Header>
                  <Accordion.Body>
                    The element from the bottom of the list is stronger than
                    those above, but since the elements go in a circle, the last
                    element is weaker than the first
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </Route>
        <Route pah="/mygame">
          <div className="gameRoom_wrapper">
            <div className="gameRoom_gameArea">
              <div className="gameRoom_players">
                <div className="gameRoom_playerBlock">
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
                      <h5>Player two: </h5>
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
              <Button variant="danger" onClick={() => window.location.reload()}>
                Close
              </Button>
              <Accordion className="helpBar">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Help</Accordion.Header>
                  <Accordion.Body>
                    The element from the bottom of the list is stronger than
                    those above, but since the elements go in a circle, the last
                    element is weaker than the first
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
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
