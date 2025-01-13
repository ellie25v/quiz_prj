import { useEffect, useState } from "react";
import Questions from "./components/questions/Questions";
import Settings from "./components/settings/Settings";
import Players from "./components/players/Players";
import Start from "./components/start/Start";
import ProgressTracker from "./components/comp/progressTracker/ProgressTracker";

import { appSettings, defaultAppSettings } from "./appSettings";
import RestoreModal from "./components/comp/restoreModal/RestoreModal";
import GameQuestions from "./components/gameQuestions/GameQuestions";
import GameReview from "./components/gameReview/GameReview";
import GamePlay from "./components/gamePlay/GamePlay";
import Statistics from "./components/statistics/Statistics";

function App() {
  const [progress, setProgress] = useState("settings");
  const [isRestore, setIsRestore] = useState(false);
  const [isRestoreSet, setIsRestoreSet] = useState(false);
  const [defaultSettings, setDefaultSettings] = useState(appSettings);

  const handleSettingsUpdate = (updatedSettings: typeof appSettings) => {
    if (
      defaultSettings.pointsPerQuestion !== updatedSettings.pointsPerQuestion ||
      defaultSettings.randomizeQuestions !==
        updatedSettings.randomizeQuestions ||
      defaultSettings.splashScreenTime !== updatedSettings.splashScreenTime
    ) {
      setDefaultSettings(updatedSettings);
      sessionStorage.setItem("appSettings", JSON.stringify(updatedSettings));
    }
  };

  useEffect(() => {
    const questions = sessionStorage.getItem("questions");
    const players = sessionStorage.getItem("players");
    const settings = sessionStorage.getItem("appSettings");

    const hasQuestions = questions && JSON.parse(questions).length > 0;
    const hasPlayers = players && JSON.parse(players).length > 0;

    if (sessionStorage.length > 0 && (hasQuestions || hasPlayers || settings)) {
      setIsRestore(true);
    }
  }, []);

  useEffect(() => {
    if (isRestoreSet) {
      const startProgress = sessionStorage.getItem("progress");
      setProgress(startProgress ? startProgress === "game" ? "gamePlayers" : startProgress : "settings");
    }
  }, [isRestoreSet]);

  const handleRestoreSession = () => {
    setIsRestoreSet(true);
    const savedSettings = sessionStorage.getItem("appSettings");
    if (savedSettings) {
      handleSettingsUpdate(JSON.parse(savedSettings));
    }
    setIsRestore(false);
  };

  const handleStartOver = () => {
    sessionStorage.clear();
    setDefaultSettings(defaultAppSettings);
    setIsRestore(false);
  };

  const moveNext = (stage: string) => {
    setProgress(stage);
    sessionStorage.setItem("progress", stage);
  };

  const handleNewGame = () => {
    handleStartOver();
    setProgress("settings");
  };

  return (
    <>
      <RestoreModal
        handleRestoreSession={handleRestoreSession}
        handleStartOver={handleStartOver}
        isRestore={isRestore}
      />
      {progress === "settings" && (
        <Settings
          moveNext={() => moveNext("questions")}
          isRestore={isRestoreSet}
          onSettingsUpdate={handleSettingsUpdate}
        />
      )}
      {progress === "questions" && (
        <Questions
          defaultSettings={defaultSettings}
          moveNext={() => moveNext("players")}
        />
      )}
      {progress === "players" && (
        <Players
          finishGame={() => moveNext("statistics")}
          isGameMode={false}
          moveNext={() => moveNext("start")}
        />
      )}
      {(progress === "questions" ||
        progress === "settings" ||
        progress === "players") && (
        <ProgressTracker
          progress={progress}
          setProgress={moveNext}
          isSettings={true}
        />
      )}

      {/* show & game mode */}

      {progress === "start" && (
        <Start
          moveNext={() => moveNext("gamePlayers")}
          splashDur={
            defaultSettings.splashScreenTime.minutes * 60000 +
            defaultSettings.splashScreenTime.seconds * 1000
          }
        />
      )}
      {progress === "gamePlayers" && (
        <Players
          isGameMode={true}
          moveNext={() => moveNext("gameQuestions")}
          finishGame={() => moveNext("statistics")}
        />
      )}
      {progress === "gameQuestions" && (
        <GameQuestions
          finishGame={() => moveNext("statistics")}
          moveNext={() => moveNext("review")}
        />
      )}
      {progress === "review" && (
        <GameReview
          moveNext={() => moveNext("game")}
          finishGame={() => moveNext("statistics")}
        />
      )}

      {(progress === "gamePlayers" ||
        progress === "gameQuestions" ||
        progress === "review") && (
        <ProgressTracker
          progress={progress}
          setProgress={moveNext}
          isSettings={false}
        />
      )}

      {progress === "game" && (
        <GamePlay moveNext={() => moveNext("gamePlayers")} />
      )}

      {progress === "statistics" && (
        <Statistics handleNewGame={handleNewGame} />
      )}
    </>
  );
}

export default App;
