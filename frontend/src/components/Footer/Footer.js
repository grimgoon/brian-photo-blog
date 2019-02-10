import React from 'react';
import styles from './Footer.module.css';

// Temporarily add Admin Upload Button to footer to try to upload images
import UploadImage from '../Admin/UploadImage/UploadImage';

const Footer = () => (
    <div className={styles.footer}>
        <UploadImage/>
    </div>
) 

export default Footer;