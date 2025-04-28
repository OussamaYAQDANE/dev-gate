/* eslint-disable */


import { doc, getDoc, getDocs, collection, where, query, arrayUnion, arrayRemove, serverTimestamp, orderBy, limit, addDoc } from "firebase/firestore"
import { auth, db } from "../firebase/firebase-config"

const [user1,user2,user3,user4,user5,user6,user7,user8,user9,user10,user11,user12,user13] = [
    "7xy6gF5vi6haBPfK7eBnOr7qGOD3","9RsatumUNdWzKU7fq8N5TVPKe0g2", "ClBaXbu5ctRwE7O6BFKVmrc9AM53",
    "FAaeSQfPZ5P3Pz8aetLzTwmG7xs2", "JQCr7d2IHlPuSCreJlEb8VVeZSo2", "QgiRTvEcVbSRKJNFg7w1q9l1FmF3",
    "S5ll9a3gpnQ56APhuh5BnLk84hs2", "SdAmxsAiTxfp1yFIVXbudNiLkon2", "W3bIxhIPLGQuwZDOYIcXaf7JxiP2",
    "anjTQdLTrSedhVUACWenubsgrv43", "eZ7FQWm6FHdLtxmVe6nmRhnryuF3", "lQvdmQMeHkVMkwHtfz11yDErtmJ2",
    "sshLW4AA2BV2qnOC7Vx7AlShYvO2"
]


const dummy_messages = [
    [
    { sender: "user1", content: "Bienvenue !", time: serverTimestamp() },
    { sender: "user3", content: "Prêt pour commencer ?", time: serverTimestamp() },
    { sender: "user2", content: "Salut tout le monde !", time: serverTimestamp() },
  ],[
    { sender: user4, content: "Quelqu’un pour une partie ?", time: serverTimestamp() },
    { sender: user5, content: "Toujours prêt !", time: serverTimestamp() },
    { sender: user4, content: "Let's go alors !", time: serverTimestamp() },
  ],[
    { sender: user8, content: "Révisions ce soir ?", time: serverTimestamp() },
    { sender: user7, content: "Oui, à 20h !", time: serverTimestamp() },
    { sender: user6, content: "Parfait, je prépare les exos.", time: serverTimestamp() },
  ],[
    { sender: user10, content: "Nouveau pitch prêt !", time: serverTimestamp() },
    { sender: user9, content: "Super ! On le teste demain ?", time: serverTimestamp() },
    { sender: user10, content: "Oui, 10h sharp !", time: serverTimestamp() },
  ],[
    { sender: user13, content: "Nouvelle playlist partagée !", time: serverTimestamp() },
    { sender: user12, content: "J’adore le son numéro 3 !", time: serverTimestamp() },
    { sender: user11, content: "On refait ça chaque semaine ?", time: serverTimestamp() },
  ],[
    { sender: user2, content: "Prochaine destination ?", time: serverTimestamp() },
    { sender: user3, content: "Je vote pour le Japon !", time: serverTimestamp() },
    { sender: user1, content: "Banco, on planifie ça.", time: serverTimestamp() },
  ],[
    { sender: user5, content: "On regarde quoi ce soir ?", time: serverTimestamp() },
    { sender: user4, content: "J’ai téléchargé Inception !", time: serverTimestamp() },
    { sender: user6, content: "Parfait, pop-corn prêt.", time: serverTimestamp() },
  ],[
    { sender: user8, content: "Le match était fou !", time: serverTimestamp() },
    { sender: user7, content: "Incroyable ce but à la 90e !", time: serverTimestamp() },
    { sender: user9, content: "On se voit pour le prochain ?", time: serverTimestamp() },
  ],
]; 
let message_counter = 0;

const dummy_groups = [
    {
      icon: "",
      title: "Les Meilleurs",
      members: [user1, user2, user3],
      admins: [user1],
      privacy: "public",
      createdAt: serverTimestamp(),
      description: "Le top du top.",
      lastMessage: {
        sender: user2,
        content: "Salut tout le monde !",
        time: serverTimestamp(),
      },
    },
    {
      icon: "",
      title: "Gamers Zone",
      members: [user4, user5],
      admins: [user5],
      privacy: "private",
      createdAt: serverTimestamp(),
      description: "Pour les accros au jeu.",
      lastMessage: {
        sender: user4,
        content: "Let's go alors !",
        time: serverTimestamp(),
      },
    },
    {
      icon: "",
      title: "Study Buddies",
      members: [user6, user7, user8],
      admins: [user6],
      privacy: "public",
      createdAt: serverTimestamp(),
      description: "Travaillons ensemble pour réussir.",
      lastMessage: {
        sender: user6,
        content: "Parfait, je prépare les exos.",
        time: serverTimestamp(),
      },
    },
    {
      icon: "",
      title: "Startup Talk",
      members: [user9, user10],
      admins: [user9],
      privacy: "private",
      createdAt: serverTimestamp(),
      description: "Entrepreneurs en action.",
      lastMessage: {
        sender: user10,
        content: "Oui, 10h sharp !",
        time: serverTimestamp(),
      },
    },
    {
      icon: "",
      title: "Music Lovers",
      members: [user11, user12, user13],
      admins: [user11],
      privacy: "public",
      createdAt: serverTimestamp(),
      description: "Tous styles confondus.",
      lastMessage: {
        sender: user11,
        content: "On refait ça chaque semaine ?",
        time: serverTimestamp(),
      },
    },
    {
      icon: "",
      title: "Travel Addicts",
      members: [user1, user2, user3],
      admins: [user1],
      privacy: "private",
      createdAt: serverTimestamp(),
      description: "Autour du monde ensemble.",
      lastMessage: {
        sender: user1,
        content: "Banco, on planifie ça.",
        time: serverTimestamp(),
      },
    },
    {
      icon: "",
      title: "Ciné Club",
      members: [user4, user5, user6],
      admins: [user4],
      privacy: "public",
      createdAt: serverTimestamp(),
      description: "Films & popcorn garantis.",
      lastMessage: {
        sender: user6,
        content: "Parfait, pop-corn prêt.",
        time: serverTimestamp(),
      },
    },
    {
      icon: "",
      title: "Foot Talk",
      members: [user7, user8, user9],
      admins: [user7],
      privacy: "public",
      createdAt: serverTimestamp(),
      description: "Foot, stats et débats.",
      lastMessage: {
        sender: user9,
        content: "On se voit pour le prochain ?",
        time: serverTimestamp(),
      },
    },
  ];


  
  const database_groups = collection(db, "groups");

  async function addGroups(){

    for (let group of dummy_groups){
        let cst = await addDoc(database_groups, group);
        let target = collection(db, "groups", cst.id, "messages");
        let current_messages = dummy_messages[message_counter];

        for (let message_ of current_messages){
            addDoc(target, message_);
        }
        message_counter += 1;
    }
    console.log("groups created")
  }

  export {addGroups}