import { useState } from 'react'
// import './App.css'
import Start from './components/start/Start';
import Questions from './components/questions/Questions';

function App() {
  const [progress, setProgress] = useState("questions");

  return (
    <>
    {progress === "start" && <Start moveNext={() => setProgress("questions")}/>}
    {progress === "questions" && <Questions moveNext={() => setProgress("players")}/>}
    </>
  )
}

export default App
