import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import './App.css';

function App() {
  const { theme, toggleTheme } = useTheme();

  const motivationalPhrases = [
    'Ты молодец!',
    'Продолжай в том же духе!',
    'Вперёд к успеху!',
    'Отличный результат!',
  ];

  const [name, setName] = useState(localStorage.getItem('name') || '');
  const [timer, setTimer] = useState(10);
  const [duration, setDuration] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState('');
  const [completedCounts, setCompletedCounts] = useState(
    JSON.parse(localStorage.getItem('completedCounts')) || {}
  );

  useEffect(() => {
    localStorage.setItem('name', name);
  }, [name]);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            const phrase =
              motivationalPhrases[
                Math.floor(Math.random() * motivationalPhrases.length)
              ];
            setMessage(`Ты справился, ${name}! 🎉 ${phrase}`);
            setCompletedCounts(prevCounts => {
              const newCounts = { ...prevCounts };
              newCounts[name] = (newCounts[name] || 0) + 1;
              localStorage.setItem(
                'completedCounts',
                JSON.stringify(newCounts)
              );
              return newCounts;
            });
            playSound();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, name, motivationalPhrases]);

  const playSound = () => {
    const audio = new Audio(
      'https://www.soundjay.com/buttons/sounds/button-10.mp3'
    );
    audio.play();
  };

  const handleStart = () => {
    if (!name) {
      alert('Введите имя!');
      return;
    }
    setIsRunning(true);
    setTimer(duration);
    setMessage('');
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimer(duration);
    setMessage('');
    setName('');
    setCompletedCounts({});
    localStorage.removeItem('name');
    localStorage.removeItem('completedCounts');
  };

  const getCountForName = () => {
    return completedCounts[name] || 0;
  };

  return (
    <div className={`app ${theme}`}>
      <h1>Таймер с мотивацией</h1>

      <button className="toggle-theme" onClick={toggleTheme}>
        Переключить тему
      </button>

      <div className="controls">
        <input
          type="text"
          placeholder="Введите ваше имя"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={isRunning}
        />

        <label>Выберите время таймера:</label>
        <select
          value={duration}
          onChange={e => setDuration(parseInt(e.target.value, 10))}
          disabled={isRunning}
        >
          <option value={10}>10 секунд</option>
          <option value={20}>20 секунд</option>
          <option value={30}>30 секунд</option>
        </select>

        <button
          className="button-main"
          onClick={handleStart}
          disabled={isRunning || !name}
        >
          Старт таймера
        </button>
        <button className="button-main" onClick={handleReset}>
          Сброс
        </button>
      </div>

      {isRunning && timer > 0 && (
        <h2 className="timer-info">{`${name}, осталось ${timer} сек`}</h2>
      )}

      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${((duration - timer) / duration) * 100}%` }}
        />
      </div>

      {message && <div className="message">{message}</div>}
      {name && (
        <h3 className="count-display">{`Таймер завершён ${getCountForName()} раз(а)`}</h3>
      )}
    </div>
  );
}

export default App;
