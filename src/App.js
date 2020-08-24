import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from "./firebase";
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([
    // {
    //   username: "Kush",
    //   caption: "Its really working...",
    //   imageUrl: "https://is2-ssl.mzstatic.com/image/thumb/Purple114/v4/df/76/95/df7695b1-e165-90ab-eecb-515727ddb7fe/Prod-0-0-1x_U007emarketing-0-0-0-6-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/246x0w.png"
    // },
    // {
    //    username: "Raj",
    //    caption: "Its really working...",
    //    imageUrl: "data:image/png;base64,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"
    // },
    // {
    //   username: "Sonal",
    //   caption: "Its really working...",
    //   imageUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAaVBMVEU6VZ////81Up0yT5xgc61+jbsvTZyXo8hFXaOirM0nSJmlrs7O1OUkRpkfQ5c1UZ1oerKHlcDp6/M9WKHHzeHV2ulxgravt9Td4Ozl6PGDkb7ByN5YbatQZ6j29/q3v9h2hrhMY6aQnMSsAnKHAAAC70lEQVR4nO3caXLiMBRFYdoihhhsQ5jDlPT+F9mdqv7bRrYQ7z7XOQug9BUWHiQzmRARERERERERERERERERqVe0IZQPCtaDHFwo62Yz/VrP3jtbrH0Sy7rYH46/YtpV1oPtX6jCbBel+2npThjq/Taa51AYmrdTH583YdHsP/r5nAnLTa/j05+w+ezv8yRsq/MQoB9hmPeegb6E5eU2DOhFWK4G+rwIw3CgD2G4Dge6ELaboXPQi7CJu4nwK6zvKUAHwvCVBHQgrFMmoQdh4jGqL2wviUB5YRP/uMKnsJ2mAtWF9XLkwjblcs2FsDqMXZh6LpQXhn06UFtYpZ7t5YX1wEczboTF/AlAaWFYP0OovPZU9pmGt9194W79sIq/Jt2uqqrytwbcxJ4NT9e6tR7soEIk8N749E2K7zjgubEe6dAi75yOboGxwrnTQ/RvRZTwIHy6e1SccF5Yj3N4UcJjbT3MhKKEh9J6mAlFCZWvyR4WJXxDqBxChPohRKgfQoT6IUSoH0KE+iFEqB9ChPqNQ1h0vKJcxWwt/aofvelsDFzNOlpECO9dH/DT+8ZUWMYgErNdfXuB8Ga7RPwCofHy2wuE59EfpQvbH9MXCNejF65st2q8QPhtu5Mhv/BmfE2TX/hhvGMqv3BpvBslv/BuvGUqv3A2+nloff+YX3gx3rmYX2j9CCC78Ga9NzO78GS9dTG7cDv679B8c2Z24e/R/9LsRy+8Wm/kzy60nobZhdb3TvmF9u8e5hYaP0p8gfB99PPQ/l2F3MKp+StDuYXWvuxC60eJ+YXm907ZhQJ/NlA+4d9ZOrrbH6WTzbyjmL+D/Oz6BNsl/H8V/y9E7TYpOz7BGveoceyn6QohQv0QItQPIUL9ECLUDyFC/RAi1A8hQv0QItQPIUL9ECLUDyFC/RAi1A8hQv0QItQPIUL9ECLUDyFC/RAi1A8hQv0QItQPIUL9ECLUDyFC/RAi1A8hQv0QItQPIUL9ECLs0R8aFUYEFLSeAgAAAABJRU5ErkJggg=="
    // }
])

useEffect(() => {
  auth.onAuthStateChanged((authUser) => {
    if(authUser){
      //user has logged in
      //console.log(authUser);
      setUser(authUser);
    } else{
      //user has logged out
      setUser(null);
    }
  })
}, [user, username]);

useEffect(() => {
  db.collection("posts").orderBy('timestamp', 'desc').onSnapshot(snapshot => {
    setPosts(snapshot.docs.map(doc => ({
      id: doc.id,
      post: doc.data()
    })));
  })
}, [])

const signUp = (e) => {
  e.preventDefault();

  auth.createUserWithEmailAndPassword(email, password)
  .then((authUser) => {
    return authUser.user.updateProfile({
      displayName: username
    })
  })
  .catch((error) => alert(error.message));

  setOpen(false);
}

const signIn = (e) => {
  e.preventDefault();

  auth.signInWithEmailAndPassword(email,password)
  .catch((error) => alert(error.message))

  setOpenSignIn(false)
}

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <center>
          <img  className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="Loading...."/>
          </center>
          
          <Input placeholder="Enter UserName"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}/>

            <Input placeholder="Enter Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>

            <Input placeholder="Enter Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>

            <Button onClick={signUp}>SignUp</Button>

        </form>
      </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <center>
          <img  className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="Loading...."/>
          </center>

            <Input placeholder="Enter Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>

            <Input placeholder="Enter Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>

            <Button onClick={signIn}>Login</Button>

        </form>
      </div>
      </Modal>

      {/* Header */}
      <div className="app__header">
        <img  className="app__headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt="Loading...."/>

      {user ? (
      <Button onClick={() => auth.signOut()}>Logout</Button>
      ): (
        <div className="app__loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Login</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
        </div>
      )}
      </div>


      {/* posts */}
      <div className="app__posts">
        <div className="app__postsLeft">
            {
              posts.map(({id, post}) => (
                <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
              ))
            }
        </div>
      <div className="app__postsRight">
        <InstagramEmbed
          url='https://www.instagram.com/p/CDrcwykscvS/?utm_source=ig_web_copy_link'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />
      </div>
      </div>


      {user?.displayName ? (
      <ImageUpload username={user.displayName}/>
      ) : (
        <h3 className="login__disable">Login to upload.</h3>
      )}
     
    </div>
  );
}

export default App;
