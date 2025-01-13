import ModalWrap from "../modalWrap/ModalWrap";
import MyBtn from "../myBtn/MyBtn";
import "./restoreModal.css";

interface RestoreModalProps {
  handleRestoreSession: () => void;
  handleStartOver: () => void;
  isRestore: boolean;
}

const RestoreModal: React.FC<RestoreModalProps> = ({
  handleRestoreSession,
  handleStartOver,
  isRestore,
}) => {
  return (
    <>
      {isRestore && (
        <ModalWrap
          isOpen={isRestore}
          onClose={handleRestoreSession}
          sizeWidth={500}
          sizeHeight={225}
          title={"Restore Previous Session?"}
        >
          <div className="restoreModal__wrapper">
            <p className="restoreModal__text">
              You have saved data from a previous session. 
            </p>
            <p className="restoreModal__text">
              Would you like to
              restore it or start over?
            </p>
            <div className="restoreModal__btnWarpper">
              <MyBtn
                color="oran"
                width={160}
                text="Start Over"
                handleClick={handleStartOver}
              />
              <MyBtn
                color="blue"
                width={160}
                text="Restore"
                handleClick={handleRestoreSession}
              />
            </div>
          </div>
        </ModalWrap>
      )}
    </>
  );
};

export default RestoreModal;
