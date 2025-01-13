import { useState } from "react";
import { Question, QuestionCategory, QuestionType } from "../questionModel";
import MyBtn from "../../comp/myBtn/MyBtn";
import ModalWrap from "../../comp/modalWrap/ModalWrap";
import defaultJson from "../../../defaultJson.json";

interface BulkImportProps {
  onImport: (questions: Question[]) => void;
}

const BulkImport: React.FC<BulkImportProps> = ({ onImport }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jsonData, setJsonData] = useState("");
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const closeModal = () => setIsModalOpen(false);

  const isImportValid = (questions: Question[]): boolean => {
    const errors: string[] = [];
    const ids = new Set<number>();
    if (questions.length <= 64) {
      questions.forEach((question, index) => {
        const { id, text, type, category, time, answers } = question;
        const ansIds = new Set<number>();
        const isQuestionValid = text && text.trim() !== "";
        const isTimeMinutesValid = time.minutes >= 0 && time.minutes <= 59;
        const isTimeSecondsValid = time.seconds >= 0 && time.seconds <= 59;
        const isTimeValid =
          isTimeMinutesValid &&
          isTimeSecondsValid &&
          (time.minutes > 0 || time.seconds > 0);

        if (!id || typeof id !== "number") {
          errors.push(
            `Question ${index + 1} is invalid: Missing or invalid ID.`
          );
        } else if (ids.has(id)) {
          errors.push(
            `Question ${index + 1} is invalid: Duplicate ID "${id}".`
          );
        } else {
          ids.add(id);
        }

        if (!Object.values(QuestionType).includes(type)) {
          errors.push(
            `Question ${
              index + 1
            } is invalid: Type "${type}" is not a valid QuestionType.`
          );
        }

        if (!Object.values(QuestionCategory).includes(category)) {
          errors.push(
            `Question ${
              index + 1
            } is invalid: Category "${category}" is not a valid QuestionCategory.`
          );
        }

        const validAnswers = answers.filter((answer) => {
          if (!answer.id || typeof id !== "number") {
            errors.push(
              `Question ${index + 1} (id: ${id}) is invalid: Missing or invalid ID for answers.`
            );
          } else if (ansIds.has(answer.id)) {
            errors.push(
              `Question ${index + 1} (id: ${id}) is invalid: Duplicate answer ID "${answer.id}".`
            );
          } else {
            ansIds.add(answer.id);
          }
          if (type === QuestionType.FILL_IN_THE_BLANKS) {
            return "blank" in answer && answer.blank?.trim() !== "";
          } else if (
            type === QuestionType.SINGLE_CHOICE ||
            type === QuestionType.MULTIPLE_CHOICE
          ) {
            return "text" in answer && answer.text?.trim() !== "";
          } else if (type === QuestionType.MATCHING) {
            return (
              "left" in answer &&
              "right" in answer &&
              answer.left?.trim() !== "" &&
              answer.right?.trim() !== ""
            );
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

        if (!isQuestionValid) {
          errors.push(`Question ${index + 1} is invalid: Text is required.`);
        }
        if (!isTimeValid) {
          errors.push(
            `Question ${
              index + 1
            } has invalid time: Minutes (0-59), Seconds (0-59), and cannot be zero.`
          );
        }
        if (
          type !== QuestionType.FILL_IN_THE_BLANKS &&
          validAnswers.length < 2
        ) {
          errors.push(
            `Question ${
              index + 1
            } is invalid: Must have at least two valid answers.`
          );
        }
        if (
          type === QuestionType.FILL_IN_THE_BLANKS &&
          validAnswers.length < 1
        ) {
          errors.push(
            `Question ${
              index + 1
            } is invalid: Must have at least one valid answer.`
          );
        }
      });
    } else {
      errors.push(`Too many questions. Maximum allowed is 64.`);
    }

    setImportErrors(errors);
    return errors.length === 0;
  };

  const handleImport = (data? : string) => {
    try {
      const parsedData = JSON.parse(data ? data : jsonData);
      if (Array.isArray(parsedData)) {
        const isValid = isImportValid(parsedData);
        if (isValid) {
          onImport(parsedData);
          setJsonData("");
          setIsModalOpen(false);
          setImportErrors([]);
        }
      } else {
        setImportErrors(["Data is not an array."]);
      }
    } catch {
      setImportErrors(["Invalid JSON data."]);
    }
  };

  const importDefault = () => {
    try {
      setJsonData(JSON.stringify(defaultJson));
      handleImport(JSON.stringify(defaultJson));
    }catch {
      setImportErrors(["Sometjing went wrong. Try again"]);
    }
  };
  

  return (
    <>
      <MyBtn
        color="blue"
        width={200}
        text="Import"
        handleClick={() => setIsModalOpen(true)}
      />
      <ModalWrap
        isOpen={isModalOpen}
        onClose={closeModal}
        sizeWidth={800}
        title={"Bulk Import Questions"}
      >
        <p className="import_warning">Warning! Import will overwrite your current added questions.</p>
        <textarea
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          placeholder="Paste JSON data here"
          rows={10}
          className="import_textarea"
        ></textarea>
        {importErrors.length > 0 && (
          <div className="import_errors">
            <ul>
              {importErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="modal__btn-wrapper">
          <MyBtn
            width={400}
            color="blue"
            text="Import Default Questions"
            handleClick={importDefault}
          />
          <MyBtn width={200} text="Import" handleClick={() => handleImport()} />
        </div>
      </ModalWrap>
    </>
  );
};

export default BulkImport;
