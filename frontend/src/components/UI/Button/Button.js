import React from 'react';
import styles from './Button.module.css'

const Button = (props) => {

    let disabledClassState = props.disabled ? styles.ButtonDisabled : styles.ButtonEnabled 
    let classes = [styles.Button, disabledClassState];
 
    return (
        <button 
            onClick={props.buttonHandler} 
            className={classes.join(' ')}
            disabled={props.disabled}>
                <img alt="Button" src={props.imgSrc}/>
                <span>{props.text}</span>
        </button>
    )
}

export default Button;