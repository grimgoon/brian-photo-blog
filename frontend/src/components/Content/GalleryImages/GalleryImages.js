import React, {Component} from 'react';
import GalleryImage from './GalleryImage/GalleryImage';
import styles from './GalleryImages.module.css';


class GalleryImages extends Component {

     baseImageURL = "https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/photographs%2F";
     queryString =  "?alt=media";

    // TODO: Try cleaning the code up. By fetching the images height. etc. first async
    // And then just from there  always filter by cross referencing one list with id,height & width VS the photolist
    // So you don't have to make async requests every time which is stupid.

    
     componentDidMount() {
        this.listImages();
     }

     componentDidUpdate() {
        if(!this.props.photoList && !this.props.error) {
            this.listImages();
        }
     }

     
    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }
    
    listImages() {

        let imageList;

        if(this.props.photoList && !this.props.error) {

            let photoFilter;

            let groupHeight = {
                group1 : 0,
                group2 : 0,
                group3 : 0,
            };

            let groups = {
                group1 : [],
                group2 : [],
                group3 : [],
            };

            if(this.props.filter === "all") {
                photoFilter = () => true;
            }
            else {
                photoFilter = (photo) => (Object.keys(photo.categories).find(category => category === this.props.filter) === undefined ? false : true)
            }
    
            this.props.photoList.filter(photoFilter).forEach((photo,i) => {

                let smallest = '';
                for (var name in groupHeight) {
                    if(smallest !== '' && groupHeight[name] < groupHeight[smallest]) {
                        smallest = name;
                    } else if (smallest === '') {
                        smallest = name;
                    }
                }

                let compareValue = 100;
                let widthComparision = compareValue / photo.width;
                let compareHeight = photo.height * widthComparision;

                groupHeight[smallest] += compareHeight;

                console.log(smallest);
                console.log(groupHeight);

                groups[smallest].push(
                    <GalleryImage 
                    key={photo.id}
                    baseURL={this.baseImageURL}
                    queryString={this.queryString}
                    id={photo.id}
                    fileType={photo.fileType}
                    index={i}
                />)

                
            });

            

            imageList = 
                <>
                    <div>
                        {groups["group1"]}
                    </div>
                    <div>
                        {groups["group2"]}
                    </div>
                    <div>
                        {groups["group3"]}
                    </div>
                </>
        
            return imageList
        
        }

        return null;
    }

    render() {

        let listImages = this.listImages();

        return (
            <div className={styles.images2}>
             {listImages}
            </div>
        );
    }

    

}



export default GalleryImages;