import React from 'react';
import styles from './Button.module.css'

const Button = (props) => {
    console.log(props.text);
    return (
        <div onClick={props.buttonHandler} className={styles.Button}>
            <img alt="Button" src={props.imgSrc}/>
            <span>{props.text}</span>
        </div>
    )
}

export default Button;