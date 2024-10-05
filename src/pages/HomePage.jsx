import React, { useState } from 'react'
import { Link } from 'react-router-dom';


function HomePage() {

    const [userName, setUserName] = useState("");

  return (
   <>
          <div className="has-text-centered" style={{ backgroundColor: '#FFF4EA', padding: '2rem' }}>
              <h1 className="title" style={{ color: '#C96868' }}>
                  "Knowledge is the key to the universe."
              </h1>
              <h2 className="subtitle" style={{ color: '#7EACB5' }}>
                  Welcome to Home Page
              </h2>

              <div className="field is-grouped is-centered" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                  <label className="label" htmlFor="username" style={{ color: '#C96868', marginRight: '1rem' }}>
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
                  to={`/quizpage/${userName}`}
                  style={{ backgroundColor: '#FADFA1', color: '#C96868', marginTop: '2rem' }}
              >
                  Start Quiz →
              </Link>
          </div>

    
   </>
  )
}

export default HomePage