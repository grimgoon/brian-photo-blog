import 'firebase/storage';
import 'firebase/database';
import 'firebase/auth';
import Firebase from 'firebase/app';
import FirebaseConfig from '../Config/Config';

Firebase.initializeApp(FirebaseConfig);
const database = Firebase.database();
