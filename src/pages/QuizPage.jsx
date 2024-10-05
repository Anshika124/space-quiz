import axios from 'axios';
import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import { useParams } from 'react-router';

function QuizPage() {
    const { userName } = useParams();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');

    const generateQuestion = async () => {
        if (questions.length >= 10) return; // Limit to 10 questions

        try {
            const response = await axios({
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAUnr7mTzp_CTLUF4Nj9QcqtON-mKvlmUw`,
                method: "post",
                data: {
                    contents: [
                        {
                            parts: [
                                {
                                    text:
                                        "Generate a quiz question related to space missions, planetary data, space weather, or astronaut records. Provide the response in the following JSON format with no other text:\n\n" +
                                        "{\n" +
                                        "  \"question\": \"[Insert question here]\",\n" +
                                        "  \"options\": {\n" +
                                        "    \"A\": \"[Option A]\",\n" +
                                        "    \"B\": \"[Option B]\",\n" +
                                        "    \"C\": \"[Option C]\",\n" +
                                        "    \"D\": \"[Option D]\"\n" +
                                        "  },\n" +
                                        "  \"correct_answer\": \"Option label of the correct answer\"\n" +
                                        "}\n\n" +
                                        "Ensure that the question is clear, relevant to the topic, and the options are plausible."
                                },
                            ],
                        },
                    ],
                },
            });

            const botResponse = JSON.parse(response.data.candidates[0].content.parts[0].text);
            setQuestions((prevQuestions) => [...prevQuestions, botResponse]);
        } catch (error) {
            console.error("Error in fetching response: ", error);
        }
    };

    const handleAnswer = (answer) => {
        const currentQuestion = questions[currentQuestionIndex];
        if (answer === currentQuestion.correct_answer) {
            setScore(score + 1);
        }

        setUserAnswer(answer);

        // Move to the next question after a delay
        setTimeout(() => {
            setUserAnswer('');
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            generateQuestion(); // Fetch the next question
        }, 1000);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        generateQuestion(); // Start generating questions on form submission
    };

    return (
        <>
            <div className="title">Hello, {userName}</div>
            <form className="input-container" onSubmit={handleSubmit}>
                <button className="button" type="submit">
                    Start Quiz
                </button>
            </form>

            {questions.length > 0 && currentQuestionIndex < questions.length && (
                <div className="quiz-container">
                    <h2 className="question-title">{questions[currentQuestionIndex].question}</h2>
                    <div className="options">
                        {Object.keys(questions[currentQuestionIndex].options).map((option) => (
                            <button
                                key={option}
                                className="button"
                                onClick={() => handleAnswer(option)}
                                disabled={userAnswer !== ''} // Disable buttons after answering
                            >
                                {option}: {questions[currentQuestionIndex].options[option]}
                            </button>
                        ))}
                    </div>
                    {userAnswer && (
                        <div className="answer-feedback">
                            {userAnswer === questions[currentQuestionIndex].correct_answer
                                ? "Correct!"
                                : "Incorrect. The correct answer was: " + questions[currentQuestionIndex].correct_answer}
                        </div>
                    )}
                </div>
            )}

            {currentQuestionIndex >= 10 && (
                <div className="score">
                    <h2>Your Score: {score} out of 10</h2>
                </div>
            )}
        </>
    );
}

export default QuizPage;
