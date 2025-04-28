/* eslint-disable */

import { doc, getDoc, getDocs, collection, where, query, arrayUnion, arrayRemove, serverTimestamp, orderBy, limit, addDoc } from "firebase/firestore"
import { auth, db } from "../firebase/firebase-config"

const discussionId = "bty9cI9nbuDIJ0uIoTqE"
const other1Uid = "utJz0lMHMafunmT1Ubu3lNaFW7Y2"
const otherUid = "W3bIxhIPLGQuwZDOYIcXaf7JxiP2"

// oussama : xhjGQahe6TM0DMKgm347aAU6Ih72

// adam : W3bIxhIPLGQuwZDOYIcXaf7JxiP2


const messages = [
    {
        sender: auth.currentUser.uid,
        content: "Bro... you ever just sit and wonder if pigeons got feelings too 🕊️",
        time: serverTimestamp()
    },
    {
        sender: otherUid,
        content: "Wtf 💀 it’s 3AM and you’re thinking about emotional pigeons?",
        time: serverTimestamp()
    },
    {
        sender: auth.currentUser.uid,
        content: "Yes bro 😔 they just be waddling in the streets like they lost everything",
        time: serverTimestamp()
    },
    {
        sender: otherUid,
        content: "Damn now I feel bad for that one I almost stepped on earlier 😭",
        time: serverTimestamp()
    },
    {
        sender: auth.currentUser.uid,
        content: "He probably had a whole family and now he’s got PTSD from your Air Forces 💀",
        time: serverTimestamp()
    },
    {
        sender: otherUid,
        content: "STOP 😭 I just imagined him in therapy with other traumatized birds",
        time: serverTimestamp()
    },
    {
        sender: auth.currentUser.uid,
        content: "‘And then the human... raised his foot... and everything went dark.’ 😩",
        time: serverTimestamp()
    },
    {
        sender: otherUid,
        content: "You need sleep bro. Real bad 💀",
        time: serverTimestamp()
    },
    {
        sender: auth.currentUser.uid,
        content: "Sleep? In this economy? Nah I’ll pass 😮‍💨",
        time: serverTimestamp()
    },
    {
        sender: otherUid,
        content: "We both gonna be hallucinating shadow people tomorrow 😭",
        time: serverTimestamp()
    },
    {
        sender: auth.currentUser.uid,
        content: "Ayo more friends for me tbh 😂 gotta be social somehow",
        time: serverTimestamp()
    },
    {
        sender: otherUid,
        content: "Bro gonna be chillin with Jeff the hallway demon 💀",
        time: serverTimestamp()
    },
    {
        sender: auth.currentUser.uid,
        content: "Me and Jeff finna drop a podcast on insomnia and emotional pigeons 😭🔥",
        time: serverTimestamp()
    }
];

async function makeDiscussionMessages() {
    const msgs= collection(db, "discussions", discussionId, "messages" )
    for (let msg of messages) {
        await addDoc(msgs, msg);
    }
}

export { makeDiscussionMessages }