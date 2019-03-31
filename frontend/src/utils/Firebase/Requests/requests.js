import 'firebase/storage';
import 'firebase/database';
import 'firebase/auth';
import Firebase from 'firebase/app';
import FirebaseConfig from '../Config/Config';

Firebase.initializeApp(FirebaseConfig);
const database = Firebase.database();


export const getPhotographList = () => {

    return new Promise((resolve, reject) => {
        
        // TODO: Error Handling
        database.ref('photographs').once('value').then((snapshot) => {
            let photographs = [];
            let values = snapshot.val();

            for(let key in  values) {
                photographs.push({
                    id: key,
                    ...values[key]
                });
            }

            photographs = photographs.sort((a, b) => (a.order) > b.order ? 1 : -1);

            return photographs
        })
        .then(resolve)
        .catch(reject)
    });
}

export const getCategoryList = async () => {

    return new Promise((resolve, reject) => {

            // TODO: Error Handling
        database.ref('categories').once('value').then((snapshot) => {
            let categories = [];
            let values = snapshot.val();

            for(let key in values) {

                categories.push({
                    id: key,
                    name : values[key],
                    status : null
                });
            }

            categories = categories.sort((a, b) => a > b ? 1 : -1);

            return categories;

        }).then(resolve).catch(reject)  
    })
}
