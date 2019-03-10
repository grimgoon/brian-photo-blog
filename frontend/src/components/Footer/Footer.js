import React from 'react';
import styles from './Footer.module.css';

const Footer = () => (
    <div className={styles.footer}>
        <div className={styles.email}>info@1-foto.com</div>
        <div className={styles.rights}>1-Foto. all rights reserved ©</div>
        <div className={styles.credits}>Made by: <a href="https://github.com/grimgoon/">Alexander Hermansson</a></div>
    </div>
) 

export default Footer;