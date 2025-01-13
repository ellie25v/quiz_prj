export let appSettings = {
  pointsPerQuestion: 0,
  randomizeQuestions: false,
  splitPoints: true,
  splashScreenTime: { minutes: 0, seconds: 3 },
};

export const defaultAppSettings = {
  pointsPerQuestion: 0,
  randomizeQuestions: false,
  splitPoints: true,
  splashScreenTime: { minutes: 0, seconds: 3 },
};


export const setAppSettings = (newSet: { pointsPerQuestion: number; randomizeQuestions: boolean; splitPoints: boolean; splashScreenTime: { minutes: number; seconds: number; }; }) => {
  appSettings = newSet;
};
