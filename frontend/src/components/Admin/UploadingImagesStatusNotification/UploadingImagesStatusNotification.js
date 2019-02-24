import React from 'react';
import styles from './UploadingImagesStatusNotification.module.css';

const UploadingImagesStatusNotification = (props) => {

    let uploadingImages = null;

    if(props.uploadingImages.length > 0) {
        uploadingImages = props.uploadingImages.map((imageUpload,i) => (
            <div 
                className={styles.notificationItem} 
                key={i}>
                <b>File:</b> {imageUpload} | Uploading <div className={styles.loadingSpinner}></div>
            </div>
        ));
    }

    return (
        <div className={styles.notificationContainer}>
            {uploadingImages}
        </div>
    )
}

export default UploadingImagesStatusNotification