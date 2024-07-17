import React, { useState, useEffect } from 'react';
import { QUESTIONS } from './questions';

const QuizComponent: React.FC = () => {
    const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
    const [showError, setShowError] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [allAnswered, setAllAnswered] = useState(false);
    const [scores, setScores] = useState<number[]>([]);

    useEffect(() => {
        // Retrieve scores from localStorage on component mount
        const storedScores = localStorage.getItem('quizScores');
        if (storedScores) {
            setScores(JSON.parse(storedScores));
        }
    }, []); // Empty dependency array ensures it only runs once on mount

    const saveScoresToLocalStorage = (updatedScores: number[]) => {
        localStorage.setItem('quizScores', JSON.stringify(updatedScores));
    };

    const handleAnswerChange = (questionNumber: number, answer: boolean) => {
        setAnswers({ ...answers, [questionNumber]: answer });
    };

    const handleSubmit = () => {
        const answeredQuestions = Object.keys(answers).length;
        const totalQuestions = Object.keys(QUESTIONS).length;

        if (answeredQuestions < totalQuestions) {
            setShowError(true);
            setAllAnswered(false);
        } else {
            setShowError(false);
            setAllAnswered(true);

            // Calculate score
            const yesCount = Object.values(answers).filter(answer => answer === true).length;
            const calculatedScore = (100 * yesCount) / totalQuestions;
            setScore(calculatedScore);

            // Update scores state with new score
            const updatedScores = [...scores, calculatedScore];
            setScores(updatedScores);

            // Save scores to localStorage
            saveScoresToLocalStorage(updatedScores);
        }
    };

    const handleReset = () => {
        setAnswers({});
        setScore(null);
        setShowError(false);
        setAllAnswered(false);
    };

    const renderQuestions = () => {
        return Object.keys(QUESTIONS).map((questionNumberStr) => {
            const questionNumber = parseInt(questionNumberStr, 10);
            return (
                <div key={questionNumber}>
                    <p>{QUESTIONS[questionNumber]}</p>
                    <div>
                        <button onClick={() => handleAnswerChange(questionNumber, true)}>Yes</button>
                        <button onClick={() => handleAnswerChange(questionNumber, false)}>No</button>
                    </div>
                </div>
            );
        });
    };

    const calculateAverageScore = () => {
        if (scores.length === 0) {
            return 0;
        }
        const sum = scores.reduce((acc, curr) => acc + curr, 0);
        return sum / scores.length;
    };

    return (
        <div>
            <h2>Quiz Component</h2>
            {renderQuestions()}
            <div style={{marginTop: "10px"}}>
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={handleReset}>Reset</button>
            </div>
            {showError && <p>Please answer all questions!</p>}
            {allAnswered && <p>Score: {score}%</p>}
            {scores.length > 0 && <p>Average Score: {calculateAverageScore()}%</p>}
        </div>
    );
};

export default QuizComponent;
