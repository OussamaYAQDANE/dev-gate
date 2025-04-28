/* eslint-disable */

import {
  doc,
  getDoc,
  updateDoc,
  getDocs,
  collection,
  where,
  query,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  orderBy,
  limit,
  addDoc,
  setDoc,
  increment,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase-config";

async function getUserById(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.data();
}

async function getMyDiscussions() {
  const q = query(
    collection(db, "discussions"),
    where("couple", "array-contains", auth.currentUser.uid),
    orderBy("lastMessage.time", "desc")
  );
  const discussionsSnapshot = await getDocs(q);

  const discussions = [];

  discussionsSnapshot.forEach((doc) => {
    discussions.push({ id: doc.id, ...doc.data() });
  });
  let promises = [];
  discussions.forEach((e) => {
    let otherUid =
      auth.currentUser.uid === e.couple[0] ? e.couple[1] : e.couple[0];
    promises.push(getUserById(otherUid));
  });
  promises = await Promise.all(promises);

  promises.forEach((e, i) => {
    discussions[i]["firstName"] = e.firstName;
    discussions[i]["lastName"] = e.lastName;
    discussions[i]["profilePic"] = e.profilePic;
  });
  return discussions;

  // discussions[i] = {
  //     couple: [],
  //     uid1: "skhkhsk",
  //     uid2: "dkhklhd",
  //     lastMessage: {},
  //     firstName: "",
  //     lastName: "",
  //     profilePic: ""
  // }
}

async function getMyGroups() {
  const q = query(
    collection(db, "groups"),
    where("members", "array-contains", auth.currentUser.uid),
    orderBy("lastMessage.time")
  );
  const groupsSnapshot = await getDocs(q);

  const groups = [];

  groupsSnapshot.forEach((doc) => {
    groups.push({ id: doc.id, ...doc.data() });
  });

  return discussions;
}

async function getDiscussionMessages(discussionId) {
  const q = query(
    collection(db, "discussions", discussionId, "messages"),
    orderBy("time", "desc")
  );
  const snapShot = await getDocs(q);
  const messages = [];
  snapShot.forEach((doc) => {
    messages.push(doc.data());
  });
  return messages;
}
function formatChatTimestamp(date) {
  const now = new Date();

  const sameDay = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const options = {
    hour: "2-digit",
    minute: "2-digit",
  };

  if (sameDay) {
    return date.toLocaleTimeString([], options); // e.g. "13:45"
  } else if (isYesterday) {
    return `Yesterday, ${date.toLocaleTimeString([], options)}`; // "Yesterday, 13:45"
  } else if (date.getFullYear() === now.getFullYear()) {
    return `${date.getDate()}/${date.getMonth() + 1}, ${date.toLocaleTimeString(
      [],
      options
    )}`; // e.g. "17/4, 13:45"
  } else {
    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}, ${date.toLocaleTimeString([], options)}`; // e.g. "17/4/2023, 13:45"
  }
}

function sendDiscussionMessage(discussionId, message) {
  const toSend = {
    sender: auth.currentUser.uid,
    content: message,
    time: serverTimestamp(),
  };
  updateDoc(doc(db, "discussions", discussionId), {
    lastMessage: toSend,
    [auth.currentUser.uid]: increment(1),
  });
  addDoc(collection(db, "discussions", discussionId, "messages"), toSend);
}

function sendGroupMessage(groupId, message) {
  const toSend = {
    sender: auth.currentUser.uid,
    content: message,
    time: serverTimestamp(),
  };
  updateDoc(doc(db, "groups", groupId), {
    lastMessage: toSend,
  });
  addDoc(collection(db, "groups", groupId, "messages"), toSend);
}
function makeDiscussionMessagesSeen(discussionId, couple) {
    let myUid = auth.currentUser.uid;
    let otherUid = couple[0] === myUid? couple[1] : couple[0];
  updateDoc(doc(db, "discussions", discussionId), { [otherUid]: 0 });
}

export {
  getMyGroups,
  getUserById,
  getMyDiscussions,
  getDiscussionMessages,
  formatChatTimestamp,
  sendDiscussionMessage,
  makeDiscussionMessagesSeen,
  sendGroupMessage
};
