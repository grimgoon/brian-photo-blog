import React from 'react';
import styles from './Button.module.css'

const ButtonSpecial = (props) => {

    let disabledClassState = props.disabled ? styles.ButtonDisabled : styles.ButtonEnabled 
    let classes = [styles.Button, disabledClassState];

    let labelClassState = props.disabled ? styles.labelDisabled : styles.labelEnabled

    return (
        <button disabled={props.disabled} className={classes.join(' ')}>
            <label htmlFor='input' className={labelClassState}>
                <img alt="Button" src={props.imgSrc}/>
                <span>{props.text}</span>
            </label>
            <input disabled={props.disabled} type='file' id='input' onChange={props.buttonHandler} multiple />
        </button>
    )
}

export default ButtonSpecial;