import { useState } from 'react';
import QuizSettings from './components/QuizSettings';
import Quiz from './components/Quiz';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleStartQuiz = (newQuestions) => {
    setQuestions(newQuestions);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleQuizComplete = () => {
    setQuizCompleted(true);
  };

  const handleReset = () => {
    setQuestions([]);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="app-container">
      <h1>Jorvan's despair of a quiz</h1>

      {questions.length === 0 ? (
        <QuizSettings onStartQuiz={handleStartQuiz} />
      ) : quizCompleted ? (
        <div className="quiz-results">
          <h2>Quiz Finished!</h2>
          <p>Your final score is: {score} / {questions.length}</p>
          <button onClick={handleReset}>Go to Settings / Reset Quiz</button>
        </div>
      ) : (
        <Quiz
          questions={questions}
          score={score}
          setScore={setScore}
          onQuizComplete={handleQuizComplete}
        />
      )}
      
      {questions.length > 0 && !quizCompleted && (
        <button onClick={handleReset} className="reset-button">
          Reset Questions
        </button>
      )}
    </div>
  );
}

export default App
