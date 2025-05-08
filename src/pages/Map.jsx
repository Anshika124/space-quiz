import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import customMarker from '../assets/custom-marker.png';
import axios from 'axios';

function Map() {
    const [questions, setQuestions] = useState([]); // Store the questions
    const [answers, setAnswers] = useState(Array(10).fill('')); // User's answers for all questions
    const [feedback, setFeedback] = useState(''); // Feedback for the answer
    const quizSectionRef = useRef(null); // Ref to the quiz section

    const customIcon = new L.Icon({
        iconUrl: customMarker, // Use the imported image path
        iconSize: [38, 38], // Size of the icon [width, height]
        iconAnchor: [19, 38], // Anchor point of the icon (usually half of iconSize to center it)
        popupAnchor: [0, -38], // Popup position relative to the iconAnchor
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'), // Optional: default shadow image
        shadowSize: [41, 41], // Size of the shadow
        shadowAnchor: [12, 41], // Anchor point of the shadow
    });

    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

    // Define a set of 25 locations with associated questions
    const locations = [
        { id: 1, name: 'Eiffel Tower, Paris', position: [48.8584, 2.2941] },
        { id: 2, name: 'Great Wall of China, China', position: [40.4319, 116.5704] },
        { id: 3, name: 'Machu Picchu, Peru', position: [-13.1631, -72.5450] },
        { id: 4, name: 'Statue of Liberty, USA', position: [40.6892, -74.0445] },
        { id: 5, name: 'Taj Mahal, India', position: [27.1751, 78.0421] },
        { id: 6, name: 'Sydney Opera House, Australia', position: [-33.8568, 151.2153] },
        { id: 7, name: 'Colosseum, Rome', position: [41.8902, 12.4922] },
        { id: 8, name: 'Christ the Redeemer, Brazil', position: [-22.9519, -43.2105] },
        { id: 9, name: 'Santorini, Greece', position: [36.3932, 25.4615] },
        { id: 10, name: 'Niagara Falls, Canada/USA', position: [43.0962, -79.0377] },
        { id: 11, name: 'Mount Fuji, Japan', position: [35.3606, 138.7274] },
        { id: 12, name: 'Stonehenge, England', position: [51.1789, -1.8262] },
        { id: 13, name: 'Burj Khalifa, Dubai', position: [25.1972, 55.2744] },
        { id: 14, name: 'Angkor Wat, Cambodia', position: [13.4125, 103.8662] },
        { id: 15, name: 'Big Ben, London', position: [51.5007, -0.1246] },
        { id: 16, name: 'Pyramids of Giza, Egypt', position: [29.9792, 31.1342] },
        { id: 17, name: 'Red Square, Moscow', position: [55.7558, 37.6173] },
        { id: 18, name: 'Table Mountain, South Africa', position: [-33.9625, 18.4092] },
        { id: 19, name: 'Galapagos Islands, Ecuador', position: [-0.7833, -90.9667] },
        { id: 20, name: 'Hagia Sophia, Turkey', position: [41.0086, 28.9794] },
        { id: 21, name: 'Acropolis of Athens, Greece', position: [37.9715, 23.7267] },
        { id: 22, name: 'Grand Canyon, USA', position: [36.1069, -112.1129] },
        { id: 23, name: 'Mount Everest, Nepal', position: [27.9881, 86.9250] },
        { id: 24, name: 'Sagrada Familia, Spain', position: [41.4036, 2.1744] },
        { id: 25, name: 'Vatican City, Italy', position: [41.9029, 12.4534] },
    ];

    // Function to handle map marker click and generate questions
    const handleMarkerClick = async (location) => {
        setFeedback(''); // Clear previous feedback
        setAnswers(Array(10).fill('')); // Clear previous answers

        // Generate quiz questions using the Gemini API
        const prompt = `Generate 10 quiz questions about ${location.name}.`;
        try {
            const response = await axios({
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                method: "post",
                data: {
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt, // Send prompt for question generation
                                },
                            ],
                        },
                    ],
                },
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const generatedQuestions = response.data.candidates[0].content.parts[0].text.split('\n'); // Split questions
            setQuestions(generatedQuestions); // Set the generated questions

            // Scroll to the quiz section
            if (quizSectionRef.current) {
                quizSectionRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error("Error in fetching questions: ", error.response?.data || error.message);
        }
    };

    // Function to validate all user's answers using the Gemini API
    const checkAnswers = async () => {
        if (questions.length === 0) {
            setFeedback("No questions available. Please select a location.");
            return;
        }

        let feedbackArray = [];

        for (let i = 0; i < questions.length; i++) {
            if (!questions[i] || !answers[i]) {
                feedbackArray[i] = "Please provide an answer.";
                continue;
            }

            const promptText = `Is the following answer correct for the question "${questions[i]}"? Answer: "${answers[i]}"`;

            try {
                const response = await axios({
                    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                    method: "post",
                    data: {
                        contents: [
                            {
                                parts: [
                                    {
                                        text: promptText, // Send question and answer for validation
                                    },
                                ],
                            },
                        ],
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const feedbackText = response.data.candidates[0].content.parts[0].text || "No feedback available";
                feedbackArray[i] = feedbackText;

            } catch (error) {
                console.error("Error in checking answer: ", error.response?.data || error.message);
                feedbackArray[i] = "An error occurred while validating your answer.";
            }
        }

        setFeedback(feedbackArray); // Store all feedback
    };

    return (
        <section className="hero is-fullheight" style={{ background: 'linear-gradient(to right, #ff7e5f, #feb47b)' }}>
            <div className="hero-body">
                <div className="container has-text-centered">
                    <h1 className="title has-text-white">Map-Based Geospatial Quiz</h1>
                    <p className="subtitle has-text-white">Click on any given region to get quiz questions for that location.</p>
                    <div className="box">
                        <MapContainer center={[20, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {locations.map((location) => (
                                <Marker key={location.id} icon={customIcon} position={location.position} eventHandlers={{ click: () => handleMarkerClick(location) }}>
                                    <Popup>
                                        <strong>{location.name}</strong>
                                        <br />
                                        Click to generate quiz questions about this location.
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                    <div ref={quizSectionRef} className="box">
                        {questions.length > 0 && (
                            <div className="quiz-section">
                                <h3 className="">Quiz Questions</h3>
                                {questions.map((question, index) => (
                                    <div key={index} className="field">
                                        <p className="is-size-6 is-family-monospace">{question}</p>
                                        <div className="control">
                                            {/* Add your input for answers */}
                                        </div>
                                    </div>
                                ))}
                                <div className="control">
                                    <button className="button is-link" onClick={checkAnswers}>
                                        Submit Answers
                                    </button>
                                </div>
                                {feedback && (
                                    <div className="notification is-info">
                                        <h3 className="subtitle has-text-white">Feedback:</h3>
                                        <ul>
                                            {feedback.map((feedbackItem, index) => (
                                                <li key={index} className="has-text-white">{`Q${index + 1}: ${feedbackItem}`}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Map;
