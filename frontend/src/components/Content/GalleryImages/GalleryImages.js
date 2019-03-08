import React, {Component} from 'react';
import GalleryImage from './GalleryImage/GalleryImage';
import styles from './GalleryImages.module.css';


class GalleryImages extends Component {

     baseImageURL = "https://firebasestorage.googleapis.com/v0/b/foto-25c4c.appspot.com/o/photographs%2F";
     queryString =  "?alt=media";

    state = {
        groupList1 : [],
        groupList2 : [],
        groupList3 : [],
    }


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

        if(this.props.photoList && !this.props.error) {

            let photoFilter;
    
            if(this.props.filter === "all") {
                photoFilter = () => true;
            }
            else {
                photoFilter = (photo) => (Object.keys(photo.categories).find(category => category === this.props.filter) === undefined ? false : true)
            }
    
            this.images = this.props.photoList.filter(photoFilter).map((photo) => (<GalleryImage key={photo.id} baseURL={this.baseImageURL} queryString={this.queryString} id={photo.id} fileType={photo.fileType} />));
            
    
            // TODO: Figure out how to use LazyLoading when using the column CSS
    
            //////////////////////////////////////////
            /// Test Version 2.0 to display images ///
            /////////////////////////////////////////
    
            // Filter all images & get all images.
            // Assign each image in imagelist to an group based on which category is shortest.
    
            // Filter ImageList and Display images in group depending on which group.
            // Start out with three groups, scale down to one on smaller devices.
            // Figure out how to display two rows properly as well.

            var groups = {
                group1 : 0,
                group2 : 0,
                group3 : 0,
            };
            
            const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

            const start = async () => {
                await this.asyncForEach(this.props.photoList.filter(photoFilter), async (photo,i) => {
                  await waitFor(50);
                  let image = new Image();
                  image.src = this.baseImageURL + photo.id + "." + photo.fileType + this.queryString;
                  image.onload = () => {
                          
                      var smallest = '';
                      for (var name in groups) {
                          if(smallest !== '' && groups[name] < groups[smallest]) {
                              smallest = name;
                          } else if (smallest === '') {
                              smallest = name;
                          }
                      }

                    let testValue = 100;
                    let widthTest = testValue / image.width;
                    let compareHeight = image.height * widthTest;



      
                      groups[smallest] += compareHeight;
      
                      let galleryImage = 
                      <GalleryImage 
                          key={photo.id}
                          baseURL={this.baseImageURL}
                          queryString={this.queryString}
                          id={photo.id} 
                          fileType={photo.fileType} 
                          index={i}
                      />
   
          
                        console.log(i,smallest);
                      // Set State properly.


                      this.setState((prevState,props) => {

                        let newState;

                        switch(smallest) {
                            case 'group1' :
                                newState= [...prevState.groupList1];
                                newState.push(galleryImage)
                                return {groupList1 : newState}
                            case 'group2' :
                                newState= [...prevState.groupList2];
                                newState.push(galleryImage)
                                return {groupList2 : newState}
                            case 'group3' :
                                newState= [...prevState.groupList3];
                                newState.push(galleryImage)
                                return {groupList3 : newState}
                            default :
                                newState= [...prevState.groupList1];
                                newState.push(galleryImage)
                                return {groupList1 : newState}
                        }
                    });

   
                    
                }
                  
                });
               
              }

            start();
        }
    }

    render() {

        console.log(this.state.groupList1);

        return (
            <div className={styles.images2}>
                <div>{this.state.groupList1}</div>
                <div>{this.state.groupList2}</div>
                <div>{this.state.groupList3}</div>
            </div>
        );
    }

    

}



export default GalleryImages;