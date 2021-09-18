import { Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./GameCard.css";

const gameCard = ({ nickname, items, socket }) => {
  return (
    <div className="gameCard_wrapper">
      <p className="gameCard_nickname">{nickname}</p>
      <div className="gameCard_tagsBlock">
        {items.map((item) => (
          <Badge key={item + Date.now()} bg="danger" className="gameCard_tags">
            {item}
          </Badge>
        ))}
      </div>
      <Link to="/innergame">
        <Button
          variant="success"
          className="gameCard_button"
          onClick={() =>
            socket.current.send(
              JSON.stringify({ event: "joingame", nickname: nickname })
            )
          }
        >
          Join
        </Button>
      </Link>
    </div>
  );
};

export default gameCard;
