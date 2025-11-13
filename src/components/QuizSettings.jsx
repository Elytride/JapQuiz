import React, { useState, useEffect } from 'react';
import { getAvailableDataFiles, loadQuizData } from '../utils/dataLoader';

/**
 * QuizSettings component allows users to select data files and start/reset the quiz.
 * @param {{ onStartQuiz: (questions: Array<{question: string, answer: string}>) => void }} props
 */
const QuizSettings = ({ onStartQuiz }) => {
  const [availableFiles, setAvailableFiles] = useState([]);
  const [selectedPaths, setSelectedPaths] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load available files on component mount
    const files = getAvailableDataFiles();
    setAvailableFiles(files);
    // Select all files by default
    setSelectedPaths(files.map(f => f.path));
  }, []);

  const handleCheckboxChange = (path) => {
    setSelectedPaths(prevPaths => {
      if (prevPaths.includes(path)) {
        return prevPaths.filter(p => p !== path);
      } else {
        return [...prevPaths, path];
      }
    });
  };

  const handleStartQuiz = async () => {
    if (selectedPaths.length === 0) {
      alert("Please select at least one data file.");
      return;
    }
    setIsLoading(true);
    try {
      const questions = await loadQuizData(selectedPaths);
      onStartQuiz(questions);
    } catch (error) {
      console.error("Failed to load quiz data:", error);
      alert("Failed to load quiz data. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="quiz-settings">
      <h2>Quiz Settings</h2>
      <p>Select the data files to include in the quiz:</p>
      <div className="file-selection">
        {availableFiles.map(file => (
          <label key={file.path} className="file-checkbox">
            <input
              type="checkbox"
              checked={selectedPaths.includes(file.path)}
              onChange={() => handleCheckboxChange(file.path)}
              disabled={isLoading}
            />
            {file.name}
          </label>
        ))}
      </div>
      <button 
        onClick={handleStartQuiz} 
        disabled={isLoading || selectedPaths.length === 0}
      >
        {isLoading ? 'Loading...' : 'Start/Reset Quiz'}
      </button>
    </div>
  );
};

export default QuizSettings;