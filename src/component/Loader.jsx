import React from 'react';
import loader from '../assets/loader.gif'; // Ensure you have the correct path to the loader.gif

function Loader() {
    return (
        <div style={styles.loaderContainer}>
            <img src={loader} alt="Loading..." style={styles.loaderImage} />
        </div>
    );
}

const styles = {
    loaderContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
        width: '100%', // Full width
        position: 'fixed', // Fixed positioning
        top: 0,
        left: 0,
        zIndex: 1000, // Ensure it appears above other content
        backgroundColor: 'transparent', // Make background transparent
    },
    loaderImage: {
        width: '50px', // Set a specific width for the loader
        height: '50px', // Set a specific height for the loader
        opacity: 0.8, // Optional: set loader opacity if you want some visibility
    },
};

export default Loader;
