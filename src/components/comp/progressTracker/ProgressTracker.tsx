import React from "react";
import "./progressTracker.css";

interface ProgressTrackerProps {
  progress: string;
  isSettings: boolean;
  setProgress: (clicked: string) => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  setProgress,
  isSettings,
}) => {
  const progressLabels = isSettings
    ? [
        { label: "Settings", progress: "settings" },
        { label: "Questions", progress: "questions" },
        { label: "Players", progress: "players" },
      ]
    : [
        { label: "Players", progress: "gamePlayers" },
        { label: "Questions", progress: "gameQuestions" },
        { label: "Review", progress: "review" },
      ];
  return (
    <div className="tracker__container">
      <button
        onClick={() => setProgress(progressLabels[0].progress)}
        className={`tracker__item ${
          progress === progressLabels[0].progress ? "active" : "past"
        }`}
      >
        <div className="tracker__item-circle"></div>
        <span className="tracker__item-label">{progressLabels[0].label}</span>
      </button>
      <div
        className={`tracker__line  ${
          progress === progressLabels[1].progress ||
          progress === progressLabels[2].progress
            ? "active-line"
            : ""
        }`}
      ></div>
      <button
        onClick={() => setProgress(progressLabels[1].progress)}
        className={`tracker__item ${
          progress === progressLabels[1].progress
            ? "active"
            : progress === progressLabels[0].progress
            ? ""
            : "past"
        }`}
      >
        <div className="tracker__item-circle"></div>
        <span className="tracker__item-label">{progressLabels[1].label}</span>
      </button>
      <div
        className={`tracker__line right ${
          progress === progressLabels[2].progress ? "active-line" : ""
        }`}
      ></div>
      <button
        onClick={() => setProgress(progressLabels[2].progress)}
        className={`tracker__item ${
          progress === progressLabels[2].progress ? "active" : ""
        }`}
      >
        <div className="tracker__item-circle"></div>
        <span className="tracker__item-label">{progressLabels[2].label}</span>
      </button>
    </div>
  );
};

export default ProgressTracker;
