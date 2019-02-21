import React from 'react';
import styles from './Button.module.css'

const ButtonSpecial = (props) => {

    let disabledClassState = props.disabled ? styles.ButtonDisabled : styles.ButtonEnabled 
    let classes = [styles.Button, disabledClassState];

    return (
        <button disabled={props.disabled} className={classes.join(' ')}>
            <label htmlFor='input'>
                <img alt="Button" src={props.imgSrc}/>
                <span>{props.text}</span>
            </label>
            <input type='file' id='input' onChange={props.buttonHandler} multiple />
        </button>
    )
}

export default ButtonSpecial;