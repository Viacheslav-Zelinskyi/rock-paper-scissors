import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { GameCard } from "../../components";
import "./GameList.css";

const GameList = ({ socket, username, games }) => {
  const history = useHistory();

  useEffect(() => {
    if (socket.current)
      socket.current.send(JSON.stringify({ event: "getgames" }));
    else history.push("/");
  });

  return (
    <div className="GameList_wrapper">
      <h1>Join game</h1>
      or
      <Link to="/newgame">
        <Button style={{ margin: "10px" }}>Create new game</Button>
      </Link>
      <div className="GameList_block">
        {games.length > 0 ? (
          games.map((game) => (
            <GameCard
              nickname={game.username}
              items={game.items}
              socket={socket}
            ></GameCard>
          ))
        ) : (
          <h3 className="GameList_emptyListHeader">There are no games at the moment, wait a second</h3>
        )}
      </div>
    </div>
  );
};

export default GameList;
