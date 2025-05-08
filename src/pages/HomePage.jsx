import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import bg from '../assets/bg.jpg';


function HomePage() {

    const [userName, setUserName] = useState("");

    return (
        <div style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            padding: '2rem'
        }}>
            <div className="has-text-centered" style={{ backgroundColor: '#fff4ea80', padding: '2rem' }}>
                <h1 className="title" style={{ color: '#C96868' }}>
                    "Knowledge is the key to the universe."
                </h1>


                <div className="field is-grouped is-centered" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                    <label className="label" htmlFor="username" style={{ color: '#C96868', marginRight: '1rem', fontSize: '1.5rem' }}>
                        Your Name
                    </label>
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            id="username"
                            name="username"
                            placeholder=""
                            required
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            style={{ borderColor: '#7EACB5', width: '200px' }} // Adjust width as needed
                        />
                    </div>
                </div>

                <Link
                    className="button is-link is-large is-rounded"
                    to={`/quizpage/${userName || "Guest"}`}
                    style={{ backgroundColor: '#f3c65e', color: '#C96868', marginTop: '2rem', }}
                >
                    Start Space Trivia →
                </Link>
                <br />
                <Link
                    className="button is-link is-large is-rounded"
                    to={`/map`}
                    style={{ backgroundColor: '#f3c65e', color: '#C96868', marginTop: '2rem' }}
                >
                    GeoExplorer Quiz →
                </Link>
            </div>


        </div>
    )
}

export default HomePage