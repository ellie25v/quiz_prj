import { useState, useEffect, useMemo } from "react";
import GameAnswers from "./comp/answers/GameAnswers";
import { Question, QuestionType } from "../questions/questionModel";
import {
  Answer,
  IFillInTheBlanksAnswer,
  IMatchingAnswer,
} from "../questions/comp/answers/answersModel";
import { Player } from "../players/playerModel";
import MyBtn from "../comp/myBtn/MyBtn";
import { appSettings } from "../../appSettings";
import "./gamePlay.css";

interface GamePlayProps {
  moveNext: () => void;
}

const GamePlay: React.FC<GamePlayProps> = ({ moveNext }) => {
  const questions: Question[] = useMemo(() => {
    return JSON.parse(sessionStorage.getItem("questions") || "[]");
  }, []);
  const question = useMemo(() => {
    return questions.find((question) => question.selected);
  }, [questions]);
  const [timeLeft, setTimeLeft] = useState(
    question ? 
    question.time.minutes * 60 + question.time.seconds : 0
  );
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState<string>("");
  const [chosenAnswers, setChosenAnswers] = useState<Answer[]>([]);
  const [writtenAnswers, setWrittenAnswers] = useState<string[]>([]);
  const [matchingAnswers, setMatchingAnswers] = useState<IMatchingAnswer[]>([]);
  const [dynamicText, setDynamicText] = useState(question?.text || "");

  useEffect(() => {
    if (question && question.text) {
      let answerIndex = 0;
      const blankArr = isAnsweredCorrectly !== "" && (question.answers.every(e => "blank" in e)) ? 
      [...question.answers.map(e => e.blank)] : writtenAnswers;
      const updatedText = question.text.replace(/_/g, () => {
        if (answerIndex < blankArr.length) {
          const answer = blankArr[answerIndex];
          answerIndex++;
          return answer !== "" ? answer : "_";
        }
        return "_";
      });

      setDynamicText(updatedText);
    } 
  }, [writtenAnswers, question, isAnsweredCorrectly]);

  const instructions = question
    ? {
        singleMultChoice: `Choose one ${
          question.type === QuestionType.MULTIPLE_CHOICE ? "or multiple" : ""
        } answer${
          question.type === QuestionType.MULTIPLE_CHOICE ? "(s)" : ""
        } you think is${
          question.type === QuestionType.MULTIPLE_CHOICE ? "/are" : ""
        } correct.`,
        fillInGuessLetter: `Fill in the blanks with ${
          question.type === QuestionType.FILL_IN_THE_BLANKS
            ? "words"
            : "letters"
        }.`,
        matching: `Match top with bottom answers. When matched they become the same color.`,
      }
    : {};

  const textAfterAnswer = question
    ? {
        yes: `You answered perfectly!!! You get ${question.points} points. Great Job!`,
        partial: `You were almost there, don't worry. You get ${isAnsweredCorrectly} points.`,
        no: `You got 0 points :(  Better luck next time.`,
      }
    : {};

  useEffect(() => {
    if (timeLeft > 0 && isAnsweredCorrectly === "") {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      answerTheQuestion();
    }
  }, [timeLeft]);

  if (!question) {
    moveNext();
    return;
  }

  const answerTheQuestion = () => {
    const playersJson = sessionStorage.getItem("players");
    const players = playersJson ? JSON.parse(playersJson) : [];
    const player = players.find((player: Player) => player.selected);
    let playerScore = 0;
    if (
      (chosenAnswers.length > 0 ||
        writtenAnswers.length > 0 ||
        matchingAnswers.length > 0) &&
      question &&
      player
    ) {
      switch (question.type) {
        case QuestionType.MULTIPLE_CHOICE:
        case QuestionType.SINGLE_CHOICE:
          if (question.answers.every((ans) => "correct" in ans)) {
            const correctAns = [...question.answers]
              .filter((a) => a.correct)
              .map((a) => a.id);
            const chosenIds = chosenAnswers.map((a) => a.id);
            const userCorrectResults: (1 | 0 | -1)[] = correctAns.map(
              (correctId) => {
                if (chosenIds.includes(correctId)) {
                  return 1;
                }
                return 0;
              }
            );
            const results = [
              ...userCorrectResults,
              ...chosenIds
                .filter((chosenId) => !correctAns.includes(chosenId))
                .map(() => -1),
            ];
            const totalScore = results.reduce((acc, curr) => acc + curr, 0);
            console.log(totalScore);
            if (totalScore === correctAns.length) {
              playerScore = question.points;
              setIsAnsweredCorrectly("yes");
            } else if (totalScore <= 0 || !appSettings.splitPoints) {
              setIsAnsweredCorrectly("no");
            } else if (
              totalScore < correctAns.length &&
              appSettings.splitPoints
            ) {
              const correctCount = userCorrectResults.filter(
                (res) => res === 1
              ).length;
              playerScore = Math.floor(
                (question.points / correctAns.length) * correctCount
              );
              setIsAnsweredCorrectly(`${playerScore}`);
            }
            const updatedPlayers = players.map((pl: Player) =>
              pl.name === player.name
                ? {
                    ...pl,
                    points: player.points + playerScore,
                    selected: false,
                    correctQ:
                      totalScore === correctAns.length
                        ? pl.correctQ + 1
                        : pl.correctQ,
                  }
                : pl
            );
            sessionStorage.setItem("players", JSON.stringify(updatedPlayers));
          }
          break;
        case QuestionType.FILL_IN_THE_BLANKS:
        case QuestionType.GUESS_THE_LETTER:
          {
            let correctBlanks: string[] = [];
            correctBlanks = question.answers.map(
              (ans) => (ans as IFillInTheBlanksAnswer).blank
            );
            // }
            const totalBlanks = correctBlanks.length;

            const correctCount = writtenAnswers.reduce(
              (count, answer, index) => {
                if (
                  answer.toLowerCase() === correctBlanks[index].toLowerCase()
                ) {
                  return count + 1;
                }
                return count;
              },
              0
            );

            if (correctCount === totalBlanks) {
              playerScore = question.points;
              setIsAnsweredCorrectly("yes");
            } else if (correctCount <= 0 || !appSettings.splitPoints) {
              setIsAnsweredCorrectly("no");
            } else if (appSettings.splitPoints && correctCount < totalBlanks) {
              playerScore = Math.floor(
                (question.points / totalBlanks) * correctCount
              );
              setIsAnsweredCorrectly(`${playerScore}`);
            }
            const updatedPlayers = players.map((pl: Player) =>
              pl.name === player.name
                ? {
                    ...pl,
                    points: player.points + playerScore,
                    selected: false,
                    correctQ:
                      correctCount === totalBlanks
                        ? pl.correctQ + 1
                        : pl.correctQ,
                  }
                : pl
            );
            sessionStorage.setItem("players", JSON.stringify(updatedPlayers));
          }
          break;
        case QuestionType.MATCHING:
          if (question.answers.every((ans) => "left" in ans)) {
            const correctAns = [...question.answers];
            let totalScore = 0;
            matchingAnswers.forEach((match) => {
              const isCorrect = correctAns.some(
                (correct) =>
                  correct.left === match.left && correct.right === match.right
              );
              if (isCorrect) {
                totalScore++;
              }
            });
            console.log(totalScore);
            if (totalScore === correctAns.length) {
              playerScore = question.points;
              setIsAnsweredCorrectly("yes");
            } else if (totalScore <= 0 || !appSettings.splitPoints) {
              setIsAnsweredCorrectly("no");
            } else if (
              totalScore < correctAns.length &&
              appSettings.splitPoints
            ) {
              playerScore = Math.floor(
                (question.points / correctAns.length) * totalScore
              );
              setIsAnsweredCorrectly(`${playerScore}`);
            }
            const updatedPlayers = players.map((pl: Player) =>
              pl.name === player.name
                ? {
                    ...pl,
                    points: player.points + playerScore,
                    selected: false,
                    correctQ:
                      totalScore === correctAns.length
                        ? pl.correctQ + 1
                        : pl.correctQ,
                  }
                : pl
            );
            sessionStorage.setItem("players", JSON.stringify(updatedPlayers));
          }
          break;
        default:
          break;
      }
    } else {
      setIsAnsweredCorrectly("no");
    }
  };

  const renderInstructions = () => {
    if (question) {
      if (isAnsweredCorrectly === "") {
        switch (question.type) {
          case QuestionType.MULTIPLE_CHOICE:
          case QuestionType.SINGLE_CHOICE:
            return (
              <p className="gameplay__instruction">
                {instructions.singleMultChoice}
              </p>
            );
          case QuestionType.FILL_IN_THE_BLANKS:
          case QuestionType.GUESS_THE_LETTER:
            return (
              <p className="gameplay__instruction">
                {instructions.fillInGuessLetter}
              </p>
            );
          case QuestionType.MATCHING:
            return (
              <p className="gameplay__instruction">{instructions.matching}</p>
            );
          default:
            return "";
        }
      } else {
        switch (isAnsweredCorrectly) {
          case "yes":
            return (
              <p className="gameplay__instruction">{textAfterAnswer.yes}</p>
            );
          case "no":
            return (
              <p className="gameplay__instruction">{textAfterAnswer.no}</p>
            );
          default:
            return (
              <p className="gameplay__instruction">{textAfterAnswer.partial}</p>
            );
        }
      }
    }
  };

  return (
    <div className="gameplay__container">
      <div className="gameplay__header">
        <h1 className="section__title">
          {Math.floor(timeLeft / 60)} : {timeLeft % 60 < 10 ? "0" : ""}
          {timeLeft % 60}
        </h1>
      </div>
      <div className="gameplay__question">
        {renderInstructions()}
        <p>Question: {dynamicText}</p>
      </div>
      <div className="gameplay__answers">
        {question && (
          <GameAnswers
            type={question.type}
            answers={question.answers}
            writtenAnswers={writtenAnswers}
            userAnswers={
              question.type === QuestionType.MULTIPLE_CHOICE ||
              question.type === QuestionType.SINGLE_CHOICE
                ? chosenAnswers
                : question.type === QuestionType.MATCHING
                ? matchingAnswers
                : []
            }
            changeUserAnswers={
              question.type === QuestionType.MULTIPLE_CHOICE ||
              question.type === QuestionType.SINGLE_CHOICE
                ? setChosenAnswers
                : question.type === QuestionType.MATCHING
                ? setMatchingAnswers
                : setWrittenAnswers
            }
            isAnswered={isAnsweredCorrectly !== ""}
          />
        )}
      </div>
      <div className="btn-wrapper">
        <MyBtn
          disabled={
            isAnsweredCorrectly !== ""
              ? false
              : chosenAnswers.length === 0 &&
                (writtenAnswers.length === 0 ||
                  writtenAnswers.every((a) => a === "")) &&
                matchingAnswers.length === 0
          }
          width={200}
          text={isAnsweredCorrectly !== "" ? "Next Question!" : "Answer"}
          handleClick={
            isAnsweredCorrectly !== "" ? moveNext : answerTheQuestion
          }
        />
      </div>
    </div>
  );
};

export default GamePlay;
