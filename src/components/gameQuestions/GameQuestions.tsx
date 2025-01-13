import { useState, useEffect } from "react";
import GameQModal from "./comp/GameQModal";
import MyBtn from "../comp/myBtn/MyBtn";
import { Question } from "../questions/questionModel";
import "./gameQuestions.css";

interface GameQuestionsProps {
  moveNext: () => void;
  finishGame: () => void;
}

const GameQuestions: React.FC<GameQuestionsProps> = ({
  moveNext,
  finishGame,
}) => {
  const [questions, setQuestions] = useState<Question[]>(() => {
    const savedQuestions = sessionStorage.getItem("questions");
    return savedQuestions
      ? JSON.parse(savedQuestions)
      : [];
  });
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    () => {
      const selectedQ = questions.find((q) => q.selected);
      return selectedQ ? selectedQ : null;
    }
  );
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const defaultSettings = sessionStorage.getItem("appSettings");
    if (defaultSettings && questions.length > 0) {
      const savedSettings = JSON.parse(defaultSettings);
      if (savedSettings.randomizeQuestions) {
        const randomQ = questions[Math.floor(Math.random() * questions.length)];
        handleSelectQuestion(randomQ);
      }
    }
  }, []);

  useEffect(() => {
    if (questions.filter((q: Question) => (!q.played)).length === 0) {
      finishGame();
    }
  }, [finishGame, questions]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentQuestion(null);
  };

  const showQuestion = (question: Question) => {
    setCurrentQuestion(question);
    openModal();
  };

  const handleSelectQuestion = (newSelectQ: Question) => {
    setSelectedQuestion(newSelectQ);
    if (newSelectQ !== null)
      setQuestions((prev) => {
        const updatedQ = prev.map((q) =>
          q.id === newSelectQ.id
            ? { ...q, selected: true }
            : { ...q, selected: false }
        );

        sessionStorage.setItem("questions", JSON.stringify(updatedQ));
        return updatedQ;
      });
    closeModal();
  };

  return (
    <>
      <div className="questions__container">
        <h1 className="section__title">Choose a Question</h1>
        <ul className="gameQuestions__qList-wrapper">
          {questions.map((question, index) =>
            question.played ? (
              ""
            ) : (
              <li
                className={`questions__qList-item list-item ${
                  selectedQuestion &&
                  selectedQuestion.id === question.id &&
                  "selected"
                }`}
                key={index}
                onClick={() => showQuestion(question)}
              >
                <h3>Q{index + 1}</h3>
              </li>
            )
          )}
        </ul>
        <div style={{ width: "440px" }} className="players__btn-wrapper">
          <MyBtn
            width={220}
            color="oran"
            text="Finish Game"
            handleClick={finishGame}
          />
          <MyBtn
            disabled={selectedQuestion === null}
            width={200}
            text={"Review"}
            handleClick={moveNext}
          />
        </div>
        {isModalOpen && (
          <GameQModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSelect={handleSelectQuestion}
            currentQuestion={currentQuestion}
          />
        )}
      </div>
    </>
  );
};

export default GameQuestions;
