import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.min.css';
import Loader from '../component/Loader';
import { useParams } from 'react-router';
import useWindowDimensions from '../component/UseWindowDimensions';

function QuizPage() {
    const { width } = useWindowDimensions();
    useEffect(() => {
        setWidthLarger(width > 640);
    }, [width])
    const { userName } = useParams();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [quizStart, setQuizStart] = useState(false)
    const [widthLarger, setWidthLarger] = useState(false);
    const [loader, setLoader] = useState(false);

    // Track when to restart
    const [restartFlag, setRestartFlag] = useState(false);

    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;


    useEffect(() => {
        if (restartFlag) {
            generateQuestion();         
            setRestartFlag(false);     
        }
    }, [restartFlag]);


    if (loader) {
        return <Loader />
    }
    const generateQuestion = async () => {

        console.log(questions);

        if (questions.length >= 10)
        {
             return; 
        }
        const randomHint = ["Mars Rovers", "Solar Flares", "Astronaut Training", "space discovery"," planetary data"," space weather"," astronaut records", "curiosity rover", "titan", "galaxy", "black hole", "space time"];
        const topicHint = randomHint[Math.floor(Math.random() * randomHint.length)];
        const correctAnswer = Math.floor(Math.random() * 4);

        try {
            setLoader(true);
            const response = await axios({
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                method: "post",
                data: {
                    contents: [
                        {
                            parts: [
                                {
                                    text:
                                        `Generate a quiz question related to ${topicHint}. 
Provide the response in **pure JSON only** with no markdown, no explanation, and no extra text, new questions. 
Respond in this exact format:

{
  "question": "Your question here",
  "options": {
    "A": "Option A",
    "B": "Option B",
    "C": "Option C",
    "D": "Option D"
  },
  "correct_answer": "${65+correctAnswer}"
}

IMPORTANT: Do not include any text outside this JSON object.`
                                },
                            ],
                        },
                    ],
                },
            });
            setLoader(false);
            // console.log(response.data);
            const rawText = response.data.candidates[0].content.parts[0].text;
            const cleanedText = rawText.replace(/```json\n([\s\S]*?)\n```/, '$1').trim();
            const botResponse = JSON.parse(cleanedText);
            // const botResponse = JSON.parse(response.data.candidates[0].content.parts[0].text);
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
        setQuestions([]);  
        setQuizStart(true); 
        setRestartFlag(true);    
       
    };

    
   


    return (
        <div className="container is-flex is-justify-content-center is-align-items-center" style={{ minHeight: '100vh', backgroundColor: '#FFF4EA' }}>
            <div className="box has-text-centered" style={{ width: widthLarger ? '50%':'90%', backgroundColor: '#FADFA1', borderRadius: '15px', padding: '2rem' }}>
                <div className="title is-3" style={{ color: '#C96868' }}>QUIZ</div>

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
                                {'('+(currentQuestionIndex+1)+')'}  {questions[currentQuestionIndex].question}
                            </h2>
                            <div className="buttons is-centered">
                                {Object.keys(questions[currentQuestionIndex].options).map((option) => (
                                    <button
                                        key={option}
                                        className={`button is-outlined is-medium is-fullwidth ${userAnswer ? 'is-static' : ''} `}
                                        style={{
                                            margin: '0.5rem 0',
                                            borderColor: '#C96868',
                                            color: '#FFAD60',
                                            backgroundColor: '#FADFA1',
                                            whiteSpace: 'normal',      
                                            wordWrap: 'break-word', 
                                            textAlign: 'left', 
                                            padding: '1rem'   
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
