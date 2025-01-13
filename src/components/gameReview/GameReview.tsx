import MyBtn from "../comp/myBtn/MyBtn";
import { Player } from "../players/playerModel";
import { Question } from "../questions/questionModel";
import "./gameReview.css";

interface GameReviewProps {
  moveNext: () => void;
  finishGame: () => void;
}

const GameReview: React.FC<GameReviewProps> = ({ moveNext, finishGame }) => {
  const players: Player[] = JSON.parse(
    sessionStorage.getItem("players") || "[]"
  );
  const questions: Question[] = JSON.parse(
    sessionStorage.getItem("questions") || "[]"
  );

  const selectedPlayer = players.find((player) => player.selected);
  const selectedQuestion = questions.find((question) => question.selected);
  const round = questions.filter((question) => question.played).length + 1;

  //   if (!selectedPlayer || !selectedQuestion) {
  //     return (
  //       <p>No player or question selected. Please check your session data.</p>
  //     );
  //   }

  const checkMoveNext = () => {
    return selectedPlayer && selectedQuestion;
  };

  const handleMoveNext = () => {
    if (selectedQuestion && selectedPlayer) {
      const updatedQ = selectedQuestion;
      updatedQ.played = true;
      const updatedQs = questions.map((q) =>
        q.id === updatedQ.id ? updatedQ : q
      );
      sessionStorage.setItem("questions", JSON.stringify(updatedQs));

      const updatedPl = selectedPlayer;
      updatedPl.questions = updatedPl.questions + 1;
      const updatedPls = players.map((pl) =>
        pl.name === updatedPl.name ? updatedPl : pl
      );
      sessionStorage.setItem("players", JSON.stringify(updatedPls));
    }
    moveNext();
  };

  return (
    <div className="gameReview__container section">
      <h1 className="section__title">Round {round}</h1>
      {!selectedPlayer ? (
        <p className="gameReview__missing">No player selected </p>
      ) : (
        <div className="gameReview__player">
          <p className="gameReview__player-name">{selectedPlayer.name}</p>
        </div>
      )}
      {!selectedQuestion ? (
        <p className="gameReview__missing">No question selected </p>
      ) : (
        <div className="gameReview__details">
          <div className="list-item">
            <span>
              Q{questions.findIndex((question) => question.selected) + 1}
            </span>
            <span>{selectedQuestion.points}p</span>
            <span>
              {selectedQuestion.category
                .replace(/-/g, " ")
                .replace(/\b\w/g, (letter) => letter.toUpperCase())}
            </span>
            <span>
              {selectedQuestion.type
                .replace(/-/g, " ")
                .replace(/\b\w/g, (letter) => letter.toUpperCase())}
            </span>
          </div>
          <div className="gameReview__timer">
            <p>
              You have {selectedQuestion.time.minutes}:
              {selectedQuestion.time.seconds < 10 ? "0" : ""}
              {selectedQuestion.time.seconds} to answer this question
            </p>
            <p>Good luck!</p>
          </div>
        </div>
      )}

      <div style={{ width: "480px" }} className="players__btn-wrapper">
        <MyBtn
          width={240}
          color="oran"
          text={"Finish Game"}
          //   handleClick={handleFinishGame}
          handleClick={finishGame}
        />
        <MyBtn
          disabled={!checkMoveNext()}
          width={200}
          text={"Play!"}
          handleClick={handleMoveNext}
        />
      </div>
    </div>
  );
};

export default GameReview;
