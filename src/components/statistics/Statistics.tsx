import Confetti from 'react-confetti-boom';
import MyBtn from "../comp/myBtn/MyBtn";
import { Player } from "../players/playerModel";
import place1 from "../../assets/statistics/1place.png";
import place2 from "../../assets/statistics/2place.png";
import place3 from "../../assets/statistics/3place.png";
import place from "../../assets/statistics/place.png";
import "./statistics.css";

interface StatisticsProps {
  handleNewGame: () => void;
}

const Statistics: React.FC<StatisticsProps> = ({ handleNewGame }) => {
  const savedPlayers = sessionStorage.getItem("players");
  const players: Player[] = savedPlayers
    ? JSON.parse(savedPlayers).sort((a: Player, b: Player) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        }
        const accuracyA = a.correctQ / a.questions;
        const accuracyB = b.correctQ / b.questions;
        if (accuracyB !== accuracyA) {
          return accuracyB - accuracyA;
        }
        return b.questions - a.questions;
      })
    : [];

  let lastPlace = 0;
  let lastStats: {
    points: number;
    accuracy: number;
    questions: number;
  } | null = null;

  return (
    <div className="statistics__container section">
        <Confetti particleCount={100} spreadDeg={64} launchSpeed={2.5}/>
      <h1 className="section__title">Statistics</h1>
      <ul className="statistics__qList-wrapper list-wrapper">
        {players.map((player, index) => {
          const currentStats = {
            points: player.points,
            accuracy: player.correctQ / player.questions,
            questions: player.questions,
          };
          if (
            !lastStats ||
            currentStats.points !== lastStats.points ||
            currentStats.accuracy !== lastStats.accuracy ||
            currentStats.questions !== lastStats.questions
          ) {
            lastPlace = index + 1;
          }

          lastStats = currentStats;
          let placeIcon = place;
          if (lastPlace === 1) {
            placeIcon = place1;
          } else if (lastPlace === 2) {
            placeIcon = place2;
          } else if (lastPlace === 3) {
            placeIcon = place3;
          }

          return (
            <li className="statistics__qList-item list-item" key={index}>
              <div>
                <img className="place myIcon" src={placeIcon} alt="place" />
                <h3>{player.name}</h3>
              </div>
              <p>{player.correctQ + "/" + player.questions} questions</p>
              <p className="statistics__item-points item-part">
                {player.points} points
              </p>
            </li>
          );
        })}
      </ul>
      <div className="btn-wrapper">
        <MyBtn width={240} text="Start Over" handleClick={handleNewGame} />
      </div>
    </div>
  );
};

export default Statistics;
