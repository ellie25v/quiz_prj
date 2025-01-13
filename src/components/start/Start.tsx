import { useRef, useEffect } from "react";
// import ParticleAnim from "./ParticleAnim";
import start_white from "../../assets/start/start_white.svg";
import start_border from "../../assets/start/start_border.svg";
import loudspeaker from "../../assets/start/loudspeaker.svg";
import icon0 from "../../assets/start/burst.svg";
import icon1 from "../../assets/start/burst_bl.svg";
import icon2 from "../../assets/start/triang.svg";
import icon3 from "../../assets/start/triang_bl.svg";
import icon4 from "../../assets/start/round_icon.svg";
import icon5 from "../../assets/start/round_icon_bl.svg";
import "./start.css";

interface StartProps {
  moveNext: () => void;
  splashDur: number;
}

const Start:React.FC<StartProps>  = ({ moveNext, splashDur }) => {
  const iconsRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const icons = iconsRef.current?.querySelectorAll("li");

    if (icons) {
      icons.forEach((icon) => {
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * (Math.min(600, 400) / 2) + 100;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        icon.style.setProperty("--x", `${x}px`);
        icon.style.setProperty("--y", `${y}px`);
      });
    }
    const timeoutId = setTimeout(() => {
      moveNext();
    }, splashDur);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="start__wrapper">
      <div style={{animationDuration: `${splashDur}ms`}} onClick={moveNext} className="start__img-wrapper">
        <ul className="start__icons-list" ref={iconsRef}>
          {Array.from({ length: 50 }).map((_, i) => (
            <li style={{animationDuration: `${splashDur}ms`}} key={i}>
              <img
                className="start__icon"
                src={
                  i % 6 === 5
                    ? icon5
                    : i % 6 === 4
                    ? icon4
                    : i % 6 === 3
                    ? icon3
                    : i % 6 === 2
                    ? icon2
                    : i % 6 === 1
                    ? icon1
                    : icon0
                }
                alt="flying icons"
              />
            </li>
          ))}
        </ul>
        <img className="start__img white" src={start_white} alt="whiteblob" />
        <img
          className="start__img border"
          src={start_border}
          alt="border img"
        />
        <img
          className="start__img loudspeaker"
          src={loudspeaker}
          alt="loudspeaker"
        />
        <h1 className="start__header">QUIZ!!!</h1>
      </div>
    </div>
  );
};

export default Start;
