import React from 'react';
import styles from './Button.module.css'

const ButtonSpecial = (props) => {

    return (
        <div className={styles.Button}>
            <label htmlFor='input'>
                <img alt="Button" src={props.imgSrc}/>
                <span>{props.text}</span>
            </label>
            <input type='file' id='input' onChange={props.buttonHandler} multiple />
        </div>
    )
}

export default ButtonSpecial;