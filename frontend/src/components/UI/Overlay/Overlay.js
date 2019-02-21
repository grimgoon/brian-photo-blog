import React from 'react';
import styles from './Overlay.module.css';

const Overlay = (props) => {
    
    let backgroundColor = props.backgroundColor === undefined ? '#5eadc5' : props.backgroundColor;

    return (
        <div 
            style = {{
                backgroundColor : backgroundColor 
            }}
            className={styles.Overlay}>
            <div className={styles.OverlayContent}>
                
            </div>
        </div>
    )

}

export default Overlay;