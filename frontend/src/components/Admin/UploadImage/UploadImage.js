import React from 'react';
import styles from './UploadImage.module.css'

const UploadImage = (props) => {

    return (
        <div className={styles.uploadImageButton}>
            <label htmlFor='multi'>
                <img alt="upload images" src="https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2FuploadImageButton.png?alt=media&token=b0c5e439-212e-4e10-bfbe-cc83cc12ae7d"/>
                <span>Upload Image</span>
            </label>
            <input type='file' id='multi' onChange={props.onChange} multiple />
    </div>
    )
}

export default UploadImage;