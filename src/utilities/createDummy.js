/* eslint-disable */

import { doc, getDoc, getDocs, collection, where, query, arrayUnion, arrayRemove, serverTimestamp, orderBy, limit, addDoc } from "firebase/firestore"
import { auth, db } from "../firebase/firebase-config"

const generateDummyData = async () => {
    try {; // get current user
      const userUid = auth.currentUser.uid; // get current user's UID
  
      const projects = [
        {
          title: "Linux Kernel",
          description: "The Linux kernel is the main part of a Linux operating system and manages the system's resources and hardware communication.",
          stack: ["C", "Makefile", "Bash"],
          githubLink: "https://github.com/torvalds/linux",
          icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Linux_logo.svg/1200px-Linux_logo.svg.png", // Linux icon
        },
        {
          title: "React",
          description: "React is a JavaScript library for building user interfaces, developed and maintained by Facebook.",
          stack: ["JavaScript", "React", "HTML", "CSS"],
          githubLink: "https://github.com/facebook/react",
          icon: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg", // React icon
        },
        {
          title: "Node.js",
          description: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine, allowing JavaScript to run on the server.",
          stack: ["JavaScript", "Node.js"],
          githubLink: "https://github.com/nodejs/node",
          icon: "https://upload.wikimedia.org/wikipedia/commons/6/64/Node.js_logo_2015.svg", // Node.js icon
        },
        {
          title: "Vue.js",
          description: "Vue.js is a progressive JavaScript framework for building UIs and single-page applications.",
          stack: ["JavaScript", "Vue.js", "HTML", "CSS"],
          githubLink: "https://github.com/vuejs/vue",
          icon: "https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg", // Vue.js icon
        },
        {
          title: "Django",
          description: "Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design.",
          stack: ["Python", "Django"],
          githubLink: "https://github.com/django/django",
          icon: "https://upload.wikimedia.org/wikipedia/commons/7/75/Django_logo.svg", // Django icon
        },
        {
          title: "TensorFlow",
          description: "TensorFlow is an open-source machine learning framework developed by Google for creating deep learning models.",
          stack: ["Python", "TensorFlow"],
          githubLink: "https://github.com/tensorflow/tensorflow",
          icon: "https://upload.wikimedia.org/wikipedia/commons/2/2d/TensorFlow_logo.svg", // TensorFlow icon
        },
        {
          title: "Bootstrap",
          description: "Bootstrap is a free and open-source CSS framework for developing responsive and mobile-first websites.",
          stack: ["HTML", "CSS", "JavaScript", "Bootstrap"],
          githubLink: "https://github.com/twbs/bootstrap",
          icon: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Bootstrap_logo.svg", // Bootstrap icon
        },
        {
          title: "Kubernetes",
          description: "Kubernetes is an open-source platform for automating containerized application deployment, scaling, and management.",
          stack: ["Go", "Kubernetes"],
          githubLink: "https://github.com/kubernetes/kubernetes",
          icon: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo.svg", // Kubernetes icon
        },
      ];
  
      const projectRef = collection(db, "users", userUid, "projects");
  
      // Loop through the projects array and add each project to Firestore
      for (let project of projects) {
        await addDoc(projectRef, project);
      }
  
      console.log("Multiple dummy projects successfully added to Firestore!");
    } catch (error) {
      console.error("Error adding dummy data to Firestore: ", error);
    }
  };

  export default generateDummyData;