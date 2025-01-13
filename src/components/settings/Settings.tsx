import React, { useState, useEffect } from "react";
import { appSettings, setAppSettings } from "../../appSettings";
import "./Settings.css";
import MyBtn from "../comp/myBtn/MyBtn";

interface SettingsProps {
  onSettingsUpdate: (updatedSettings: typeof appSettings) => void;
  moveNext: () => void;
  isRestore: boolean;
}

const Settings: React.FC<SettingsProps> = ({
  onSettingsUpdate,
  moveNext,
  isRestore,
}) => {
  const [points, setPoints] = useState(appSettings.pointsPerQuestion);
  const [randomizeQuestions, setRandomizeQuestions] = useState(
    appSettings.randomizeQuestions
  );
  const [splitPoints, setSplitPoints] = useState(appSettings.splitPoints);
  const [splashScreenTime, setSplashScreenTime] = useState(
    appSettings.splashScreenTime
  );

  useEffect(() => {
    if (isRestore) {
      const savedSettings = sessionStorage.getItem("appSettings");
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setPoints(parsedSettings.pointsPerQuestion);
        setRandomizeQuestions(parsedSettings.randomizeQuestions);
        setSplashScreenTime(parsedSettings.splashScreenTime);
      }
    }
  }, [isRestore]);

  useEffect(() => {
    onSettingsUpdate({
      pointsPerQuestion: points,
      randomizeQuestions,
      splashScreenTime,
      splitPoints
    });
  }, [points, randomizeQuestions, splashScreenTime, splitPoints]);

  const setSelectedTime = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const prevTime = { ...splashScreenTime }[field];
    const val = e.target.value;
    setSplashScreenTime({
      ...splashScreenTime,
      [field]: !isNaN(+val) && +val <= 59 && +val >= 0 ? +val : prevTime,
    });
  };

  const setSelectedPoints = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prevPoints = points;
    const val = e.target.value;
    setPoints(!isNaN(+val) && +val <= 100 && +val >= 0 ? +val : prevPoints);
  };
  const nextBtn = () => {
    setAppSettings({
      pointsPerQuestion: points,
      randomizeQuestions,
      splashScreenTime,
      splitPoints
    });
    moveNext();
  };

  return (
    <div className="settings__container">
      <h1 className="section__title">Settings</h1>

      <div className="settings__item">
        <label>
          Default points<span className="hint">(max: 100)</span>:
        </label>
        <input
          type="text"
          onChange={(e) => setSelectedPoints(e)}
          value={points}
        />
      </div>

      <div className="settings__item">
        <label>Randomize questions:</label>
        <input
          className="settings__checkbox"
          type="checkbox"
          checked={randomizeQuestions}
          onChange={(e) => setRandomizeQuestions(e.target.checked)}
        />
      </div>

      <div className="settings__item">
        <label>Split points for each correct answer:</label>
        <input
          className="settings__checkbox"
          type="checkbox"
          checked={splitPoints}
          onChange={(e) => setSplitPoints(e.target.checked)}
        />
      </div>

      <div className="settings__item">
        <label>
          Splash screen time<span className="hint"> (min:sec)</span>:
        </label>
        <div className="settings__time ">
          <input
            type="text"
            value={splashScreenTime.minutes}
            onChange={(e) => setSelectedTime(e, "minutes")}
            placeholder="Minutes"
            required
          />
          :
          <input
            type="text"
            value={splashScreenTime.seconds}
            onChange={(e) => setSelectedTime(e, "seconds")}
            min={0}
            max={59}
            placeholder="Seconds"
            required
          />
        </div>
      </div>
      <div className="btn-wrapper">
        <MyBtn width={200} text="Next" handleClick={nextBtn} />
      </div>
    </div>
  );
};

export default Settings;
