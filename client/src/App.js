import { Route, Switch, useHistory } from "react-router-dom";
import { GameList, GameRoom, MainPage, NewGame } from "./page";
import { useEffect, useRef, useState } from "react";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [username, setUsername] = useState("");
  const [games, setGames] = useState([]);
  const [items, setItems] = useState([]);
  const [player2Username, setPlayer2Username] = useState("");
  const [result, setResult] = useState('');

  const socket = useRef();
  const history = useHistory();

  if (username.length < 1) history.push("/");

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8082");

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      switch (message.event) {
        case "gamelist":
          setGames(message.games);
          break;
        case "join":
          setPlayer2Username(message.username);
          break;
        case "gameinfo":
          setPlayer2Username(message.game.username);
          setItems(message.game.items)
          break;
        case "gameresult":
          setResult(message.playerTwoMove)
          break;
        default:
          console.log(message);
          break;
      }
    };
  }, []);

  return (
    <div className="App">
      <Switch>
        <Route path="/newgame">
          <NewGame
            socket={socket}
            username={username}
            items={items}
            setItems={setItems}
          ></NewGame>
        </Route>
        <Route path="/joingame">
          <GameList
            socket={socket}
            games={games}
            username={username}
          ></GameList>
        </Route>
        <Route path={["/mygame", "/innergame"]}>
          <GameRoom
            player2Username={player2Username}
            username={username}
            items={items}
            socket={socket}
            result={result}
          ></GameRoom>
        </Route>
        <Route path="/">
          <MainPage
            username={username}
            setUsername={setUsername}
            socket={socket}
          ></MainPage>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
