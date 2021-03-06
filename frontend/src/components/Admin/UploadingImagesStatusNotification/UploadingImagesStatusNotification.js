import React from 'react';
import styles from './UploadingImagesStatusNotification.module.css';
import Button from '../../../utils/UI/Button/Button';

const UploadingImagesStatusNotification = (props) => {

    let uploadingImages = null;

    if(props.uploadingImages.length > 0) {
        uploadingImages = props.uploadingImages.map((imageUpload,i) => {

            let statusIconClass = styles.loadingSpinner;
            let statusMessage = "Uploading";

            if(imageUpload.status === "uploaded") {
                statusIconClass = styles.successIcon
                statusMessage = "Success";
            }
            else if(imageUpload.status === "error" && imageUpload.errorMessage) {
                statusIconClass = styles.errorIcon
                statusMessage = imageUpload.errorMessage;    
            }
            else if(imageUpload.status === "error") {
                statusIconClass = styles.errorIcon
                statusMessage = "An Error Occurred. Please try Again later";      	
            }

            return <>
                <div className={styles.notificationItemFileName} style={{gridColumnStart : "1", gridRowStart : i+1}}>
                    <b>File:</b> {imageUpload.name}
                </div>
                <div
                    style={{
                        gridColumnStart : "2",
                        gridRowStart : i+1
                    }}
                    className={styles.notificationItemStatus} 
                    key={i}>
                     | {statusMessage}
                </div>
                <div 
                    style={{
                        gridColumnStart : "3",
                        gridRowStart : i+1
                    }}
                    className={styles.statusIcon  +  " " + statusIconClass}>
                </div>
            </>
        });
    }

    return (
        <div className={styles.notificationContainer}>
            {uploadingImages}
            <Button
                disabled={props.buttonDisabled}
                text="Close Notification"
                imgSrc={"https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Fdelete_image.png?alt=media&token=111cebaa-7814-49c9-a2fb-050082ce04ea"} 
                buttonHandler={props.closeNotification}/>
        </div>
    )
}

export default UploadingImagesStatusNotification