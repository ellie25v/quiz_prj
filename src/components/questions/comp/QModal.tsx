import React, { useState } from "react";
import Answers from "./answers/Answers.tsx";
import ModalWrap from "../../comp/modalWrap/ModalWrap.tsx";
import MyBtn from "../../comp/myBtn/MyBtn.tsx";
import { Answer } from "./answers/answersModel.tsx";
import { Question, QuestionCategory, QuestionType } from "../questionModel.tsx";
import "./qModal.css";

interface QModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Question) => void;
  defaultSettings: {
    pointsPerQuestion: number;
  };
  onUpdate: (formData: Question) => void;
  currentQuestion: Question | null;
}

const QModal: React.FC<QModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultSettings,
  onUpdate,
  currentQuestion,
}) => {
  const [question, setQuestion] = useState(
    currentQuestion ? currentQuestion.text : ""
  );
  const [points, setPoints] = useState(
    currentQuestion ? currentQuestion.points : defaultSettings.pointsPerQuestion
  );
  const [type, setType] = useState<QuestionType>(
    currentQuestion
      ? (currentQuestion.type as QuestionType)
      : QuestionType.SINGLE_CHOICE
  );
  const [time, setTime] = useState(
    currentQuestion ? currentQuestion.time : { minutes: 0, seconds: 0 }
  );
  const [cat, setCat] = useState<QuestionCategory>(
    currentQuestion
      ? (currentQuestion.category as QuestionCategory)
      : QuestionCategory.SCIENCE
  );
  const [answers, setAnswers] = useState<Answer[]>(
    currentQuestion ? currentQuestion.answers : []
  );

  const isFormValid = () => {
    const isQuestionValid = question.trim() !== "";
    const isTimeMinutesValid = time.minutes >= 0 && time.minutes <= 59;
    const isTimeSecondsValid = time.seconds >= 0 && time.seconds <= 59;
    const isTimeValid =
      isTimeMinutesValid &&
      isTimeSecondsValid &&
      (time.minutes > 0 || time.seconds > 0);

    const validAnswers = answers.filter((answer) => {
      if (type === QuestionType.FILL_IN_THE_BLANKS) {
        if ("blank" in answer) {
          return answer.blank && answer.blank.trim() !== "";
        }
      } else if (
        type === QuestionType.SINGLE_CHOICE ||
        type === QuestionType.MULTIPLE_CHOICE
      ) {
        if ("text" in answer) {
          return answer.text && answer.text.trim() !== "";
        }
      } else if (type === QuestionType.MATCHING) {
        if ("left" in answer && "right" in answer) {
          return (
            answer.left &&
            answer.left.trim() !== "" &&
            answer.right &&
            answer.right.trim() !== ""
          );
        }
      } else if (type === QuestionType.GUESS_THE_LETTER) {
        if ("blank" in answer) {
          return (
            answer.blank &&
            answer.blank.trim() !== "" &&
            answer.blank.trim().length === 1
          );
        }
      }
      return false;
    });

    const hasCorrectAnswer =
      (type === QuestionType.SINGLE_CHOICE ||
        type === QuestionType.MULTIPLE_CHOICE) &&
      answers.some((answer) => "correct" in answer && answer.correct);

    const isAnswersValid = (type === QuestionType.FILL_IN_THE_BLANKS &&
      validAnswers.length >= 1) ||
      validAnswers.length >= 2 &&
      ((type !== QuestionType.SINGLE_CHOICE &&
        type !== QuestionType.MULTIPLE_CHOICE) 
        || hasCorrectAnswer
      );

    return isAnswersValid && isQuestionValid && isTimeValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isUpdate = currentQuestion !== null;
    const newQ: Question = {
      id: isUpdate ? currentQuestion.id : Date.now(),
      text: question,
      category: cat,
      points,
      type,
      time,
      answers,
      selected: false,
      played: false,
    };
    if (isUpdate) {
      onUpdate(newQ);
    } else {
      onSubmit(newQ);
    }

    onClose();
  };

  const handleAnswerChange = (id: number, field: string, value: unknown) => {
    setAnswers((prev) =>
      prev.map((answer) => {
        if (answer.id === id) {
          if (
            type === QuestionType.SINGLE_CHOICE &&
            field === "correct" &&
            value === true
          ) {
            return { ...answer, [field]: value };
          } else {
            return { ...answer, [field]: value };
          }
        } else if (
          type === QuestionType.SINGLE_CHOICE &&
          field === "correct" &&
          value === true
        ) {
          return { ...answer, correct: false };
        }
        return answer;
      })
    );
  };

  const setSelectedType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prevType = type;
    const newType = e.target.value;
    setType(newType as QuestionType);
    if (
      (prevType === QuestionType.MULTIPLE_CHOICE ||
        prevType === QuestionType.SINGLE_CHOICE) &&
      (newType === QuestionType.MULTIPLE_CHOICE ||
        newType === QuestionType.SINGLE_CHOICE)
    ) {
      setAnswers((prev) =>
        prev.map((answer) => {
          return { ...answer, correct: false };
        })
      );
    } else {
      setAnswers([]);
    }
  };

  const setSelectedTime = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const prevTime = { ...time }[field];
    const val = e.target.value;
    setTime({
      ...time,
      [field]: !isNaN(+val) && +val <= 59 && +val >= 0 ? +val : prevTime,
    });
  };

  const setSelectedPoints = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prevPoints = points;
    const val = e.target.value;
    setPoints(!isNaN(+val) && +val <= 100 && +val >= 0 ? +val : prevPoints);
  };

  const addAnswer = () => {
    if (answers.length >= 4) return;

    const newAnswer: Answer = (() => {
      switch (type) {
        case QuestionType.MULTIPLE_CHOICE:
        case QuestionType.SINGLE_CHOICE:
          return {
            id: Date.now(),
            type: type,
            text: "",
            correct: false,
          };

        case QuestionType.MATCHING:
          return {
            id: Date.now(),
            type: type,
            left: "",
            right: "",
          };

        case QuestionType.GUESS_THE_LETTER:
        case QuestionType.FILL_IN_THE_BLANKS:
          return {
            id: Date.now(),
            type: type,
            blank: "",
          };
      }
    })();

    if (newAnswer) {
      setAnswers((prev) => [...prev, newAnswer]);
    }
  };

  const handleRemoveAnswer = (id: number) => {
    setAnswers((prev) => prev.filter((answer) => answer.id !== id));
  };

  const inputs = document.querySelectorAll("#question-form input");
  inputs.forEach((input) => {
    const inputElement = input as HTMLInputElement;

    inputElement.addEventListener("blur", () => {
      if (!inputElement.validity.valid) {
        input.classList.add("invalid");
      }
    });

    inputElement.addEventListener("input", () => {
      if (inputElement.validity.valid) {
        input.classList.remove("invalid");
      }
    });
  });

  return (
    <ModalWrap
      isOpen={isOpen}
      onClose={onClose}
      sizeWidth={800}
      title={currentQuestion !== null ? "Update Question" : "Add Question"}
    >
      <form id="question-form" onSubmit={handleSubmit}>
        <div className="modal__body">
          <label>
            Question:
            <input
              type="text"
              placeholder="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </label>

          {(type === QuestionType.GUESS_THE_LETTER ||
            type === QuestionType.FILL_IN_THE_BLANKS) && (
            <p className="hint">
              For Guess The Letter & Fill In The Blanks please include "_" where
              missing part goes
            </p>
          )}
          <div className="modal__catPointInput-wrapper">
            <label className="modal__catInput-wrapper">
              Category:
              <select
                id="modal__question-cat"
                value={cat}
                onChange={(e) => setCat(e.target.value as QuestionCategory)}
                required
              >
                {Object.values(QuestionCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace(/-/g, " ")
                      .replace(/\b\w/g, (letter) => letter.toUpperCase())}
                  </option>
                ))}
              </select>
            </label>
            <label className="modal__pointsInput-wrapper">
              Points: <span>(max: 100)</span>
              <input
                type="text"
                value={points}
                onChange={(e) => setSelectedPoints(e)}
                placeholder="Points"
                required
              />
            </label>
          </div>
          <div className="modal__typeTimeInput-wrapper">
            <label className="modal__typeInput-wrapper">
              Type:
              <select
                id="modal__question-type"
                value={type}
                onChange={(e) => setSelectedType(e)}
                required
              >
                {Object.values(QuestionType).map((questionType) => (
                  <option key={questionType} value={questionType}>
                    {questionType
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (letter) => letter.toUpperCase())}
                  </option>
                ))}
              </select>
            </label>
            <label className="modal__label-time">
              Time:
              <div>
                <input
                  type="text"
                  value={time.minutes}
                  onChange={(e) => setSelectedTime(e, "minutes")}
                  placeholder="Minutes"
                  required
                />
                :
                <input
                  type="text"
                  value={time.seconds}
                  onChange={(e) => setSelectedTime(e, "seconds")}
                  min={0}
                  max={59}
                  placeholder="Seconds"
                  required
                />
              </div>
            </label>
          </div>
          <div className="modal__answers">
            <Answers
              type={type}
              answers={answers}
              onChange={handleAnswerChange}
              addAnswer={addAnswer}
              onRemove={handleRemoveAnswer}
              questionBlanks={[...question].filter((x) => x === "_").length}
            />
          </div>
        </div>
        <div className="btn-wrapper">
          <MyBtn
            disabled={!isFormValid()}
            width={200}
            text={currentQuestion !== null ? "Update" : "Add"}
            handleClick={handleSubmit}
          />
        </div>
      </form>
    </ModalWrap>
  );
};

export default QModal;
