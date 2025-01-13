import { useEffect, useState } from "react";
import QModal from "./comp/QModal";
import BulkImport from "./comp/BulkImport";
import MyBtn from "../comp/myBtn/MyBtn";
import { Question } from "./questionModel";
import "./questions.css";
import del from "../../assets/delete.svg";

interface QuestionProps {
  defaultSettings: {
    pointsPerQuestion: number;
  };
  moveNext: () => void;
}

const Questions: React.FC<QuestionProps> = ({ defaultSettings, moveNext }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(() => {
    const savedQuestions = sessionStorage.getItem("questions");
    return savedQuestions ? JSON.parse(savedQuestions) : [];
  });
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentQuestion(null);
  };

  useEffect(() => {
    sessionStorage.setItem("questions", JSON.stringify(questions));
  }, [questions]);
  

  const handleAddQuestion = (formData: Question) => {
    setQuestions([...questions, formData]);
  };

  const handleUpdateQuestion = (formData: Question) => {
    setQuestions((prev) =>
      prev.map((el) => (el.id === formData.id ? formData : el))
    );
  };

  const editQuestion = (question: Question) => {
    setCurrentQuestion(question);
    openModal();
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };


  const handleExport = () => {
    const json = JSON.stringify(questions, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "questions.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset questions? This action cannot be undone."
      )
    ) {
      sessionStorage.removeItem("questions");
      setQuestions([]);
      alert("Questions has been reset.");
    }
  };

  return (
    <div className="questions__container">
      <h1 className="section__title">Questions</h1>
      <ul
        style={{ display: questions.length > 0 ? "block" : "none" }}
        className="questions__qList-wrapper list-wrapper"
      >
        {questions.map((question, index) => (
          <li className="questions__qList-item list-item" key={index} onClick={() => editQuestion(question)}>
            <div>
              <img className="q_delete myIcon" src={del} alt="Delete"
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleDeleteQuestion(question.id);
                }}/>
              <h3>Q{index + 1}</h3>
            </div>
            <p>
              {question.category.charAt(0).toUpperCase() +
                question.category.slice(1).toLowerCase()}
            </p>
            <p className="questions__item-type item-part">
              {question.type
                .replace(/-/g, " ")
                .replace(/\b\w/g, (letter) => letter.toUpperCase())}
            </p>
          </li>
        ))}
      </ul>
      <div className="questions__btn-wrapper">
        <MyBtn
          color="oran"
          width={200}
          text="Reset"
          handleClick={handleReset}
        />
        <BulkImport
          onImport={(importedQuestions) => setQuestions(importedQuestions)}
        />
        <MyBtn
          color="blue"
          width={200}
          text="Export"
          handleClick={handleExport}
        />
        <MyBtn
          disabled={questions.length >= 64}
          color="oran"
          size={37}
          width={60}
          text="+"
          handleClick={openModal}
        />
        <MyBtn
          disabled={questions.length === 0}
          width={200}
          text="Next"
          handleClick={moveNext}
        />
      </div>
      {isModalOpen && <QModal
        isOpen={isModalOpen}
        defaultSettings={defaultSettings}
        onClose={closeModal}
        onSubmit={handleAddQuestion}
        onUpdate={handleUpdateQuestion}
        currentQuestion={currentQuestion}
      />}
    </div>
  );
};

export default Questions;
