import Firebase from 'firebase/app';
import 'firebase/storage';

import config from './Config/Config';

  const firebase = () => {

        const fb = Firebase
        .initializeApp(config)
        .storage()
        .ref();

        return fb

}


export default firebase;



