import "./myBtn.css";

interface MyBtnProps {
  color?: string;
  width?: number;
  text: string;
  icon?: string | undefined;
  disabled?: boolean;
  size?: number;
  handleClick: (e: React.FormEvent) => void;
}

const MyBtn: React.FC<MyBtnProps> = ({
  color = "yel",
  width = 234,
  size = 24,
  icon,
  text,
  handleClick,
  disabled = false
}) => {
  return (
    <button
      className={`myBtn myBtn-${color}`}
      style={{ width: `${width}px`, fontSize: `${size}px` }}
      onClick={handleClick}
      disabled={disabled}
    >
      {text}
      {icon && <img className="myBtn__icon" src={icon} alt="btn icon" />}
    </button>
  );
};

export default MyBtn;
