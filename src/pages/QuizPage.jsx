import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.min.css';
import useWindowDimensions from './UseWindowDimensions';
import { useParams } from 'react-router';

function QuizPage() {
    const { userName } = useParams();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [quizStart, setQuizStart] = useState(false)
    const [widthLarger, setWidthLarger] = useState(false);
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
        setQuizStart(true)
        generateQuestion(); // Start generating questions on form submission
    };

    

    const handleRestart = () => {
        // Reset the quiz state
        setCurrentQuestionIndex(0);  // Set back to the first question
        setScore(0);  // Reset the score
        setUserAnswer('');  // Clear any previous user answer
       
    };

    const { width } = useWindowDimensions();
    console.log(width);
    useEffect(() => {
       
        setWidthLarger(width > 640);
    }, [width])


    return (
        <div className="container is-flex is-justify-content-center is-align-items-center" style={{ minHeight: '100vh', backgroundColor: '#FFF4EA' }}>
            <div className="box has-text-centered" style={{ width: widthLarger ? '50%':'90%', backgroundColor: '#FADFA1', borderRadius: '15px', padding: '2rem' }}>
                <div className="title is-3" style={{ color: '#C96868' }}>Blast off into the quiz, {userName}!</div>

                <form className="input-container" onSubmit={handleSubmit}>
                    {quizStart ? (
                        <div className="block">
                            <h2 className="title is-5" style={{ color: '#7EACB5' }}>Score: {score}</h2>
                        </div>
                    ) : (
                        <button className="button is-large is-fullwidth" type="submit" style={{ backgroundColor: '#7EACB5', color: '#C96868' }}>
                            Start Quiz
                        </button>
                    )}
                </form>

                {questions.length > 0 && currentQuestionIndex < questions.length && (
                    <div className="quiz-container mt-5">
                        <div className="box" style={{ backgroundColor: '#FFAD60', borderRadius: '12px' }}>
                            <h2 className="question-title title is-5" style={{ color: '#FFF4EA' }}>
                                {questions[currentQuestionIndex].question}
                            </h2>
                            <div className="buttons is-centered">
                                {Object.keys(questions[currentQuestionIndex].options).map((option) => (
                                    <button
                                        key={option}
                                        className={`button is-outlined is-medium is-fullwidth ${userAnswer ? 'is-static' : ''}`}
                                        style={{
                                            margin: '0.5rem 0',
                                            borderColor: '#C96868',
                                            color: '#FFAD60',
                                            backgroundColor: '#FADFA1'
                                        }}
                                        onClick={() => handleAnswer(option)}
                                        disabled={userAnswer !== ''}
                                    >
                                        {option}: {questions[currentQuestionIndex].options[option]}
                                    </button>
                                ))}
                            </div>
                            {userAnswer && (
                                <div className={`notification ${userAnswer === questions[currentQuestionIndex].correct_answer ? 'is-success' : 'is-danger'} has-text-centered mt-3`}
                                    style={{
                                        backgroundColor: userAnswer === questions[currentQuestionIndex].correct_answer ? '#7EACB5' : '#F19ED2',
                                        color: '#C96868'
                                    }}>
                                    {userAnswer === questions[currentQuestionIndex].correct_answer
                                        ? "Correct!"
                                        : "Incorrect. The correct answer was: " + questions[currentQuestionIndex].correct_answer}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {currentQuestionIndex >= 10 && (
                    <div className="score has-text-centered mt-5">
                        <div className="box" style={{ backgroundColor: '#FFF4EA', borderRadius: '12px' }}>
                            <h2 className="title is-4" style={{ color: '#7EACB5' }}>Your Score: {score} out of 10</h2>
                            <button className="button is-medium mt-4" onClick={handleRestart} style={{ backgroundColor: '#FFAD60', color: '#C96868' }}>
                                Play Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>



    );
}

export default QuizPage;
