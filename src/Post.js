import React, {useState, useEffect} from 'react';
import './Post.css';
import {db} from './firebase';
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";

function Post({postId, user,username, caption, imageUrl}) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe = db.collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) =>{
                setComments(snapshot.docs.map((doc) => doc.data()));
            })
        }

        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (e) => {
        e.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment("");
    }

    return (
        <div className="post">
            {/* header -> avatar + username */}
            <div className="post__header">
                <Avatar className="post__avatar"
                src="https://is2-ssl.mzstatic.com/image/thumb/Purple114/v4/df/76/95/df7695b1-e165-90ab-eecb-515727ddb7fe/Prod-0-0-1x_U007emarketing-0-0-0-6-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/246x0w.png"
                alt="Kush"/>
            <h3>{username}</h3>
            </div>

            {/* image */}
            <img className="post__image"
            src={imageUrl}
            alt="Loading..."/>

            {/* username + caption */}
            <h4 className="post__text"><strong>{username}:</strong> {caption}</h4>

            <div className="post__comments">
                {
                    comments.map((comment) => (
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))
                }
            </div>

                {user && (
                    <form className="post__commentBox">
                    <input className="post__input" type="text"
                    placeholder="Comment..." value={comment}
                    onChange={(e) => setComment(e.target.value)}/>

                    <button disabled={!comment} className="post__button"
                    type="submit" onClick={postComment}>Post</button>
                    </form>
                )}

        </div>
    )
}

export default Post
