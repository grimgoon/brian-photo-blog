import React from 'react';
import styles from './Header.module.css';
import NavLinks from './NavLinks/NavLinks';

const Header = (props) => {
    
    return (
        <div className={styles.header}>
            <img src="https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/Assets%2Flogo.png?alt=media&token=22c1cd35-5ca7-4ad9-b83c-da86502a3939" alt="" className={styles.logo} />
            <NavLinks/>
        </div>
    );
}

export default Header;