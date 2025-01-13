import { useEffect, useMemo, useState } from "react";
import { IMatchingAnswer } from "../../../questions/comp/answers/answersModel";

interface GameMatchingAnswerProps {
  answers: IMatchingAnswer[];
  matchingAnswers: IMatchingAnswer[];
  setMatchingAnswers: (listA: IMatchingAnswer[]) => void;
  isAnswered: boolean;
}

const GameMatchingAnswer: React.FC<GameMatchingAnswerProps> = ({
  answers,
  matchingAnswers,
  setMatchingAnswers,
  isAnswered,
}) => {
  const [selectedAnswerTop, setSelectedAnswerTop] = useState<string | null>();
  const [selectedAnswerBottom, setSelectedAnswerBottom] = useState<
    string | null
  >();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>();
  const shuffleMatchingArray = (shuffled: string[]) => {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  const [bRow, setBRow] = useState<string[]>(
    shuffleMatchingArray([...answers].map((a) => a.right))
  );
  // const tRow = useMemo(() => shuffleMatchingArray([...answers].map((a) => a.left)), [answers]);
  // const bRow = useMemo(() => shuffleMatchingArray([...answers].map((a) => a.right)), [answers]);
  const tRow = useMemo(() => answers.map((a) => a.left), [answers]);

  useEffect(() => {
    if (isAnswered) {
      setBRow(answers.map((a) => a.right));
      setSelectedAnswer(null);
    }
  }, [isAnswered]);

  // const handleSelectAnswer = (answer: string, row: "top" | "bottom") => {
  //   if (row === "top") {
  //     setSelectedAnswerTop(answer);
  //     setSelectedAnswer(answer);
  //   } else if (row === "bottom") {
  //     setSelectedAnswerBottom(answer);
  //     setSelectedAnswer(answer);
  //   }
  //   console.log(selectedAnswerTop,selectedAnswerBottom )
  //   console.log(selectedAnswerTop && selectedAnswerBottom )

  //   if ((selectedAnswerTop) && selectedAnswerBottom) {
  //     const existingMatches = matchingAnswers.filter(
  //       (pair) =>
  //         pair.left === selectedAnswerTop ||
  //         pair.right === selectedAnswerBottom
  //     );

  //     const updatedChosenAnswers = matchingAnswers.filter(
  //       (pair) =>
  //         !existingMatches.some(
  //           (match) =>
  //             (match.left === pair.left && match.right === pair.right) ||
  //             (match.left === pair.right && match.right === pair.left)
  //         )
  //     );

  //     let nextId = 1;
  //     while (updatedChosenAnswers.some((match) => match.id === nextId)) {
  //       nextId++;
  //     }
  //     console.log(nextId);
  //     nextId = nextId > 4 ? 4 : nextId;

  //     const newMatch = {
  //       left: selectedAnswerTop,
  //       right: selectedAnswerBottom,
  //       id: nextId,
  //       type: "matching",
  //     } as IMatchingAnswer;

  //     if (!matchingAnswers.some((match) => match.id === newMatch.id)) {
  //       const newMatches = [...matchingAnswers, newMatch];
  //       setMatchingAnswers(newMatches);
  //     }

  //     setSelectedAnswerTop(null);
  //     setSelectedAnswerBottom(null);
  //     setSelectedAnswer(null);
  //   }
  //   if (selectedAnswerTop && row === 'bottom') {
  //     setSelectedAnswerBottom(answer);
  //   }

  //   if (selectedAnswerBottom && row === 'top') {
  //     setSelectedAnswerTop(answer);
  //   }
  // };
  const handleSelectAnswer = (answer: string, row: "top" | "bottom") => {
    let updatedTop = selectedAnswerTop;
    let updatedBottom = selectedAnswerBottom;

    if (row === "top") {
      updatedTop = answer;
      setSelectedAnswerTop(answer);
    } else if (row === "bottom") {
      updatedBottom = answer;
      setSelectedAnswerBottom(answer);
    }

    setSelectedAnswer(answer);

    console.log("Updated Top:", updatedTop, "Updated Bottom:", updatedBottom);

    if (updatedTop && updatedBottom) {
      const existingMatches = matchingAnswers.filter(
        (pair) => pair.left === updatedTop || pair.right === updatedBottom
      );
      console.log(existingMatches);

      const updatedChosenAnswers = matchingAnswers.filter(
        (pair) =>
          !existingMatches.some(
            (match) =>
              (match.left === pair.left && match.right === pair.right) ||
              (match.left === pair.right && match.right === pair.left)
          )
      );
      console.log(updatedChosenAnswers);

      let nextId = 1;
      while (updatedChosenAnswers.some((match) => match.id === nextId)) {
        nextId++;
      }
      nextId = nextId > 4 ? 4 : nextId;
      console.log(nextId);

      const newMatch = {
        left: updatedTop,
        right: updatedBottom,
        id: nextId,
        type: "matching",
      } as IMatchingAnswer;

      if (!matchingAnswers.some((match) => match.id === newMatch.id)) {
        const newMatches = [...matchingAnswers, newMatch];
        setMatchingAnswers(newMatches);
      } else {
        const newMatches = [...updatedChosenAnswers, newMatch];
        setMatchingAnswers(newMatches);
      }

      setSelectedAnswerTop(null);
      setSelectedAnswerBottom(null);
      setSelectedAnswer(null);
    }
  };

  const renderAnswerItem = (answer: string, row: "top" | "bottom") => {
    const isClicked = selectedAnswer === answer;
    const match = matchingAnswers.find((pair) =>
      row === "top" ? pair.left === answer : pair.right === answer
    );
    const matchedId = match ? match.id : "";
    let isCorrect = false;
    if(isAnswered && match){
         isCorrect = answers.some(
          (correct) => 
            (correct.left === match.left && correct.right === match.right)
          
        );
    }

    return (
      <li
        key={answer}
        onClick={isAnswered ? ()=>{} : () => handleSelectAnswer(answer, row)}
        className={`answers__matching-item ${isClicked ? "clicked" : ""} ${
          matchedId ? `matching-${matchedId}` : ""
        } ${isAnswered ? isCorrect ? "correct" : "incorrect" : ""}` }
      >
        {answer}
      </li>
    );
  };

  return (
    <>
      <ul className="answers__singMult-list">
        {tRow.map((a) => renderAnswerItem(a, "top"))}
      </ul>
      <ul className="answers__singMult-list">
        {bRow.map((a) => renderAnswerItem(a, "bottom"))}
      </ul>
    </>
  );
};

export default GameMatchingAnswer;
