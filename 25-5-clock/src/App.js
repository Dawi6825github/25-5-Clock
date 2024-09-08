import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [breakLength, setBreakLength] = useState(5); // default to 5 minutes
  const [sessionLength, setSessionLength] = useState(25); // default to 25 minutes
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false); // timer running status
  const [onBreak, setOnBreak] = useState(false); // break status

  // Handle break increment/decrement
  const incrementBreak = () => {
    if (breakLength < 60) setBreakLength(breakLength + 1);
  };

  const decrementBreak = () => {
    if (breakLength > 1) setBreakLength(breakLength - 1);
  };

  // Handle session increment/decrement
  const incrementSession = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      if (!isRunning) setTimeLeft((sessionLength + 1) * 60); // update time if timer is not running
    }
  };

  const decrementSession = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      if (!isRunning) setTimeLeft((sessionLength - 1) * 60);
    }
  };

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 0) {
            document.getElementById('beep').play();
            if (!onBreak) {
              setOnBreak(true);
              return breakLength * 60;
            } else {
              setOnBreak(false);
              return sessionLength * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isRunning && timeLeft !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, breakLength, sessionLength, onBreak]);

  // Format timeLeft to mm:ss
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Start/Stop timer
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // Reset timer and lengths
  const resetTimer = () => {
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setOnBreak(false);
    const audio = document.getElementById('beep');
    audio.pause();
    audio.currentTime = 0;
  };

  return (
    <div className="App">
      <h1>25 + 5 Clock</h1>
  
      {/* Control Panel for Break and Session */}
      <div className="control-panel">
        {/* Break Controls */}
        <div id="break-label">
          <h2>Break Length</h2>
          <div className="control-buttons">
            <button id="break-decrement" onClick={decrementBreak}>-</button>
            <span id="break-length">{breakLength}</span>
            <button id="break-increment" onClick={incrementBreak}>+</button>
          </div>
        </div>
  
        {/* Session Controls */}
        <div id="session-label">
          <h2>Session Length</h2>
          <div className="control-buttons">
            <button id="session-decrement" onClick={decrementSession}>-</button>
            <span id="session-length">{sessionLength}</span>
            <button id="session-increment" onClick={incrementSession}>+</button>
          </div>
        </div>
      </div>
  
      {/* Timer Display */}
      <div id="timer-label">
        <h2>{onBreak ? "Break" : "Session"}</h2>
        <div id="time-left">{formatTimeLeft()}</div>
      </div>
  
      {/* Start/Stop and Reset Buttons */}
      <button id="start_stop" onClick={toggleTimer}>Start/Stop</button>
      <button id="reset" onClick={resetTimer}>Reset</button>
  
      {/* Audio Element */}
      <audio id="beep" src="https://www.soundjay.com/button/beep-07.wav" preload="auto" />
    </div>
  );
}  

export default App;
