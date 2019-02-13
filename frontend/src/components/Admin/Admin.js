import React, {Component} from 'react';
import UploadImage from './UploadImage/UploadImage';

import Firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/database';
import FirebaseConfig from '../Firebase/Config/Config';

class Admin extends Component {

    state = {
        uploadingImage: false,
        imageList: null
    }

    componentDidMount() {
        Firebase.initializeApp(FirebaseConfig);

        this.getImageList();
    }

    uploadImage = (event) => {
        const files = Array.from(event.target.files);
        console.log(files);

        const folderReference = 'photographs/';

        //TODO: Check if the files have right fileTypes etc.

        const storageRef  = Firebase.storage().ref();
        const database = Firebase.database();
        
        this.setState({uploadingImage : true})

        files.forEach((file, i) => {

            let fileReference = folderReference + file.name;
            let imageReference = storageRef.child(fileReference);

            //TODO: Check if the image already exists in the list to not overwrite!

            imageReference.put(file).then(function(snapshot) {

                console.log(file);

                let fileData = file.name.split('.');

                let imageName = fileData[0];
                let fileType = fileData[1];

                //TODO: Add category field to the data we're writing

                database.ref(folderReference).child(imageName).set({
                    fileType : fileType,
                    date : Date.now(),
                });

                //TODO: Learn to check if writing to Firebase fails. If so - Delete the image from storage (?)
      
                // TODO - figure out why Async + State aren't buddies
                if(files.length === i+1) {
                    this.setState({uploadingImage : false})
                }

            }).catch((error) => {
                // Error to upload file 
            });
        })
    }

    getImageList = () => {

        const database = Firebase.database();
        database.ref('photographs').on('value', (snapshot) => {
            let images = [];
            for(let key in  snapshot.val) {
                images.push({
                    id: key,
                    ...snapshot.val[key]
                });
            }
            this.setState({imageList : images});
        })
    }

    render() {

        console.log(this.state);

        let uploadingStatus = this.state.uploadingImage.toString()

        return (
            <div>
                <UploadImage onChange={this.uploadImage}/>
                Uploading: {uploadingStatus}
            </div>
        )
    }
}

export default Admin;