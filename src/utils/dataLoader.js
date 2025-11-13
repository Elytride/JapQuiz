// Use Vite's import.meta.glob to dynamically import all JSON files in the data directory
const modules = import.meta.glob('/data/*.json', { eager: true });

/**
 * Extracts the filename (without extension) from the module path.
 * @param {string} path The full path of the module (e.g., "/data/Adjectives.json")
 * @returns {string} The filename (e.g., "Adjectives")
 */
const getFileName = (path) => {
  const parts = path.split('/');
  const filenameWithExt = parts[parts.length - 1];
  return filenameWithExt.replace(/\.json$/, '');
};

/**
 * Returns a list of available quiz data files.
 * @returns {Array<{name: string, path: string}>}
 */
export const getAvailableDataFiles = () => {
  return Object.keys(modules).map(path => ({
    name: getFileName(path),
    path: path,
  }));
};

/**
 * Loads the content of the selected data files.
 * @param {Array<string>} selectedPaths Array of file paths to load.
 * @returns {Promise<Array<{question: string, answer: string}>>} A promise that resolves to a flattened array of questions.
 */
export const loadQuizData = async (selectedPaths) => {
  let allQuestions = [];

  for (const path of selectedPaths) {
    const module = modules[path];
    if (module && module.default) {
      // Each item in the JSON array is an object like {"answer": "question"}
      const data = module.default;
      
      // Transform the data into a standard format {question: string, answer: string}
      const transformedData = data.flatMap(item => {
        const keys = Object.keys(item);
        if (keys.length === 1) {
          const answer = keys[0];
          const question = item[answer];
          return [{ question, answer }];
        }
        return [];
      });

      allQuestions = allQuestions.concat(transformedData);
    }
  }

  // Simple shuffle function
  for (let i = allQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
  }

  return allQuestions;
};