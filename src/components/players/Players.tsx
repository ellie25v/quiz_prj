import React, { useState, useEffect } from "react";
import PlayerModal from "./comp/PlayersModal";
import MyBtn from "../comp/myBtn/MyBtn";
import "./players.css";
import { Player } from "./playerModel";
import { Question } from "../questions/questionModel";

interface PlayersProps {
  moveNext: () => void;
  isGameMode: boolean;
  finishGame: () => void;
}

const Players: React.FC<PlayersProps> = ({
  moveNext,
  isGameMode,
  finishGame,
}) => {
  const [players, setPlayers] = useState<Player[]>(() => {
    const savedPlayers = sessionStorage.getItem("players");
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlreadyExist, setIsAlreadyExist] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(() => {
    const savedPlayers = sessionStorage.getItem("players");
    return savedPlayers
      ? JSON.parse(savedPlayers).find((player: Player) => player.selected)?.name
      : null;
  });

  useEffect(() => {
    sessionStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    const savedQuestions = sessionStorage.getItem("questions");
    const questions: Question[] = savedQuestions
      ? JSON.parse(savedQuestions)
      : [];
    if (questions.filter((q: Question) => (!q.played)).length === 0 && isGameMode) {
      finishGame();
    }
  }, [finishGame, isGameMode]);

  const closeModal = () => {
    setIsAlreadyExist(false);
    setIsModalOpen(false);
  };

  const addPlayer = (name: string) => {
    if (players.findIndex((e) => e.name === name) === -1) {
      const newPlayer: Player = {
        name,
        points: 0,
        questions: 0,
        correctQ: 0,
        selected: false,
      };
      setPlayers((prev) => [...prev, newPlayer]);
      closeModal();
    } else {
      setIsAlreadyExist(true);
    }
  };

  const updatePlayer = (oldName: string, newName: string) => {
    if (oldName === newName) {
      closeModal();
    } else if (players.findIndex((e) => e.name === newName) === -1) {
      const updatePlayer: Player = {
        name: newName,
        points: 0,
        questions: 0,
        correctQ: 0,
        selected: false,
      };
      setPlayers((prev) =>
        prev.map((pl) => (pl.name === oldName ? updatePlayer : pl))
      );
      closeModal();
    } else {
      setIsAlreadyExist(true);
    }
  };

  const deletePlayer = (name: string) => {
    setPlayers((prev) => prev.filter((pl) => pl.name !== name));
    closeModal();
  };

  const editPlayer = (player: string) => {
    setCurrentPlayer(player);
    setIsModalOpen(true);
  };

  const handleSelectPlayer = (player: string) => {
    if (isGameMode) {
      setSelectedPlayer(player);
      setPlayers((prev) => {
        const updatedPlayers = prev.map((pl) =>
          pl.name === player
            ? { ...pl, selected: true }
            : { ...pl, selected: false }
        );

        sessionStorage.setItem("players", JSON.stringify(updatedPlayers));
        return updatedPlayers;
      });
    }
  };

  const checkMoveNext = () => {
    if (isGameMode) {
      return selectedPlayer;
    } else {
      const savedQuestions = sessionStorage.getItem("questions");
      const questions = savedQuestions ? JSON.parse(savedQuestions) : [];
      return players.length > 0 && questions.length > 0;
    }
  };

  const moveNextScreen = () => {
    if (checkMoveNext()) moveNext();
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all data? This action cannot be undone."
      )
    ) {
      sessionStorage.clear();
      alert("All app data has been reset.");
    }
  };

  return (
    <div className="players__container">
      <h1 className="section__title">
        {isGameMode ? "Choose a Player" : "Players"}
      </h1>
      <ul className="players__list">
        {players.map((player) => (
          <li
            key={player.name}
            className={`players__item ${
              isGameMode
                ? selectedPlayer === player.name
                  ? "selected"
                  : ""
                : "hoverable"
            }`}
            onClick={() =>
              isGameMode
                ? handleSelectPlayer(player.name)
                : editPlayer(player.name)
            }
          >
            <p>
              {player.name.length > 8
                ? `${player.name.slice(0, 7)}..`
                : player.name}
            </p>
            {isGameMode && <p>{player.points} points</p>}
          </li>
        ))}

        {!isGameMode && players.length < 8 && (
          <button
            className="players__addBtn"
            onClick={() => {
              setCurrentPlayer(null);
              setIsModalOpen(true);
            }}
          >
            +
          </button>
        )}
      </ul>

      <div
        style={{ width: isGameMode ? "480px" : "440px" }}
        className="players__btn-wrapper"
      >
        <MyBtn
          width={isGameMode ? 240 : 200}
          color="oran"
          text={isGameMode ? "Finish Game" : "Reset all"}
          handleClick={isGameMode ? finishGame : handleReset}
        />
        <MyBtn
          disabled={!checkMoveNext()}
          width={200}
          text={!isGameMode ? "Start Game" : "Next"}
          handleClick={moveNextScreen}
        />
      </div>

      {isModalOpen && (
        <PlayerModal
          currentPlayer={currentPlayer}
          isAlreadyExist={isAlreadyExist}
          onSave={(name: string) =>
            currentPlayer ? updatePlayer(currentPlayer, name) : addPlayer(name)
          }
          onClose={() => closeModal()}
          onDelete={
            currentPlayer ? () => deletePlayer(currentPlayer) : () => {}
          }
          isOpen={isModalOpen}
        />
      )}
    </div>
  );
};

export default Players;
