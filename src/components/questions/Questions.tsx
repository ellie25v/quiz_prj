import { useState } from "react";
import Modal from "./comp/Modal";
import { Question } from "./questionModel";
import "./questions.css";

const Questions = ({ moveNext }: { moveNext: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]); // To store the added questions

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  const handleAddQuestion = (formData: Question) => {
    setQuestions([...questions, formData]);
  };


  return (
    <div className="questions__wrapper">
      <h1 className="questions__header">Questions</h1>
      <ul className="questions__qList-wrapper">
      {questions.map((question, index) => (
          <li key={index}>
            <h3>{question.text}</h3>
            <p>{question.category}</p>
            <p>{question.type}</p>
            {/* <ul>
              {question.answers.map((answer: string, i: number) => (
                <li key={i}>{answer}</li>
              ))}
            </ul> */}
          </li>
        ))}
      </ul>
      <button onClick={openModal}>Add Question</button>
      <Modal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleAddQuestion} />
    </div>
  );
};

export default Questions;
