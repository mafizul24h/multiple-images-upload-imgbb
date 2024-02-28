import React, { useState } from 'react';

const imageKey = import.meta.env.IMG_SECRET_KEY;

const App = () => {
  // const [img, setImg] = useState();
  const imageHosting = `https://api.imgbb.com/1/upload?key=c8ab2a09ec3a2107e95ea7ceec5ed1c4`
  // console.log(imageHosting);

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const cover = event.target.cover.files[0];
    const photos = event.target.photo.files;
    // console.log(name, email, password, photo);
    const user = { name, email, password }
    // console.log(user)

    // Single Image Upload 
    const formData = new FormData();
    formData.append('image', cover);

    fetch(imageHosting, {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(resData => {
      console.log(resData)
      if(resData.success) {
        console.log(resData.data.display_url);
        user.coverImage = resData.data.display_url;
      }
    })

    // Multiple Image Upload 
    const uploadPromises = [];

    for (let i = 0; i < photos.length; i++) {
      const formData = new FormData();
      formData.append('image', photos[i]);

      const uploadPromise = fetch(imageHosting, {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((resData) => {
          // console.log(resData);
          if (resData.success) {
            // console.log(resData.data.display_url);
            return resData.data.display_url;
          }
        });

      uploadPromises.push(uploadPromise);
    }

    Promise.all(uploadPromises)
      .then((imageUrls) => {
        user.images = imageUrls;
        console.log(user);
      })
      .catch((error) => {
        console.error('Error uploading images:', error);
      });
  }


  return (
    <div>
      <h1>Image Upload</h1>
      <form onSubmit={handleSubmit}>
        <label ><b>Name</b></label> <br />
        <input type="text" name='name' /> <br /> <br />
        <label ><b>Email</b></label> <br />
        <input type="email" name='email' /> <br /> <br />
        <label ><b>Password</b></label><br />
        <input type="password" name='password' /> <br /> <br />
        <label ><b>Cover Image</b></label><br />
        <input type="file" name='cover' /> <br /> <br />
        <label ><b>Photos Galary</b></label><br />
        <input type="file" name='photo' multiple /> <br /> <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default App;