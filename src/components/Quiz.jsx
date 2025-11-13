import React, { useState } from 'react';

/**
 * Quiz component handles the core quiz logic.
 * @param {{ 
 *   questions: Array<{question: string, answer: string}>, 
 *   score: number, 
 *   setScore: (score: number) => void,
 *   onQuizComplete: () => void
 * }} props
 */
const Quiz = ({ questions, score, setScore, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null); // { type: 'correct' | 'incorrect', message: string }
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const normalizeAnswer = (text) => text.toLowerCase().trim();

  const handleCheckAnswer = (e) => {
    e.preventDefault();
    if (!currentQuestion) return;

    const userAnswer = normalizeAnswer(userInput);
    const correctAnswer = normalizeAnswer(currentQuestion.answer);

    if (userAnswer === correctAnswer) {
      // Correct answer
      setScore(score + 1);
      setFeedback({ type: 'correct', message: 'Correct!' });
      setTimeout(handleNextQuestion, 1500); // Move to next question after a short delay
    } else {
      // Incorrect answer
      setFeedback({ 
        type: 'incorrect', 
        message: `Incorrect. The correct answer is: ${currentQuestion.answer}` 
      });
      setIsAnswerRevealed(true);
    }
  };

  const handleNextQuestion = () => {
    setUserInput('');
    setFeedback(null);
    setIsAnswerRevealed(false);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz finished
      onQuizComplete();
    }
  };

  if (!currentQuestion) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="quiz-container">
      <h2>Quiz in Progress</h2>
      <p>Score: {score} / {currentQuestionIndex}</p>
      <p>Question {currentQuestionIndex + 1} of {totalQuestions}</p>

      <div className="question-card">
        <p className="question-text">{currentQuestion.question}</p>
        
        <form onSubmit={handleCheckAnswer}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your answer here"
            disabled={isAnswerRevealed}
          />
          <button type="submit" disabled={isAnswerRevealed || userInput.trim() === ''}>
            Check Answer
          </button>
        </form>

        {feedback && (
          <div className={`feedback ${feedback.type}`}>
            {feedback.message}
          </div>
        )}

        {isAnswerRevealed && (
          <button onClick={handleNextQuestion} className="next-button">
            Next Question
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;