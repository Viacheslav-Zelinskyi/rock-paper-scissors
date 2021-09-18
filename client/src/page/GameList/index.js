import { useEffect, useState } from "react";
import { Badge, Button, Form } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { GameCard } from "../../components";
import "./GameList.css";

const GameList = ({ socket, games }) => {
  const [searchTags, setSearchTags] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (socket.current)
      socket.current.send(JSON.stringify({ event: "getgames" }));
    else history.push("/");
  }, []);

  const addSearchTags = (event) => {
    const inputValue = event.target[0].value;
    event.preventDefault();
    setSearchTags([...searchTags, ...inputValue.split(" ")]);
  };

  return (
    <div className="GameList_wrapper">
      <h1>Join game</h1>
      or
      <Link to="/newgame">
        <Button style={{ margin: "10px" }}>Create new game</Button>
      </Link>
      <div className="GameList_search_wrapper">
        <Form onSubmit={addSearchTags}>
          <div className="GameList_search">
            <Form.Control placeholder="Search tag" />
            <Button type="submit" variant="success">
              Add
            </Button>
            <Button variant="danger" onClick={() => setSearchTags([])}>
              Reset
            </Button>
          </div>
        </Form>
        <div className="GameList_searchTags">
          {searchTags.map((item) => (
            <Badge bg="danger" className="GameList_searchTag">
              {item}
            </Badge>
          ))}
        </div>
      </div>
      <div className="GameList_block">
        {games.length > 0 ? (
          games.map((game) =>
            searchTags.every((it) => game.items.includes(it)) ? (
              <GameCard
                key={game.username + Date.now()}
                nickname={game.username}
                items={game.items}
                socket={socket}
              ></GameCard>
            ) : null
          )
        ) : (
          <h3 className="GameList_emptyListHeader">
            There are no games at the moment, wait a second
          </h3>
        )}
      </div>
    </div>
  );
};

export default GameList;
