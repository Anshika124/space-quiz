import React, { useState } from 'react'
import { Link } from 'react-router-dom';


function HomePage() {

    const [userName, setUserName] = useState("");

  return (
   <>
    <div>Welcome to Home Page</div>
          
              <div className="form-group">
                  <label htmlFor="username">Your Name </label>
                  <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder=""
                      required
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)}
                  />
              </div>
          <Link className='headerLinks' to={`/quizpage/${userName}`}>Start Quiz →</Link>
    
   </>
  )
}

export default HomePage