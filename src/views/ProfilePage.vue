<script setup>
/* eslint-disable */
import { db, auth } from '@/firebase/firebase-config';
import { getDoc, doc, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router';
import defaultProfile from '@/assets/default-profile.png'
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const route = useRoute();
const target = computed(()=>{
    return route.params.id;
})
const user = ref({})
const isLoading = ref(false)
const showMessageForm = ref(false)
const messageContent = ref('')
const isSending = ref(false)
const sendMessageAppear = ref(true);

async function loadProfile() {
    isLoading.value = true;
    const SnapDoc = await getDoc(doc(db, "users", target.value));
    user.value = SnapDoc.data();
    const q = query(collection(db, "discussions"), where("couple", "array-contains", auth.currentUser.uid));


    if (target.value === auth.currentUser.uid) {
        sendMessageAppear.value = false;
    }
    else {
        const snapshot = await getDocs(q)
        snapshot.docs.forEach(doc =>{
            if (doc.data().couple.includes(target.value)){
                console.log(doc.data().couple, target.value);
                sendMessageAppear.value = false;

            }

        })
    }
    console.log(sendMessageAppear.value);
    isLoading.value = false
}

async function sendMessage() {
    if (!messageContent.value.trim()) return

    try {
        isSending.value = true
        const s = await addDoc(collection(db, "discussions"), {
            couple: [target.value, auth.currentUser.uid],
            time: serverTimestamp(),
            lastMessage: {
                sender: auth.currentUser.uid,
                content: messageContent.value.trim(),
                time: serverTimestamp()
            }
        })
        await addDoc(collection(db, "discussions", s.id, "messages"), {
            sender: auth.currentUser.uid,
            content: messageContent.value,
            time: serverTimestamp()
        });

        messageContent.value = ''
        showMessageForm.value = false
        alert('Message sent successfully!')
    } catch (error) {
        console.error('Error sending message:', error)
        alert('Error sending message. Please try again.')
    } finally {
        isSending.value = false
    }
}

loadProfile()
</script>

<template>
    <div v-if="isLoading" class="d-flex w-100 h-100 justify-content-center align-items-center">
        <loading-spinner />
    </div>
    <div v-else class="container mt-5">
        <div class="card shadow">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-3 text-center">
                        <img :src="user.profilePic || defaultProfile" :alt="`${user.firstName}'s profile picture`"
                            class="img-fluid rounded-circle mb-3"
                            style="width: 150px; height: 150px; object-fit: cover;">
                    </div>
                    <div class="col-md-9">
                        <h1 class="card-title mb-1 text-light">{{ user.firstName }} {{ user.lastName }}</h1>
                        <p class="text-muted mb-3">@{{ user.username }}</p>
                        <button @click="showMessageForm = !showMessageForm" class="btn btn-primary"
                            v-if="auth.currentUser && sendMessageAppear">
                            {{ showMessageForm ? 'Cancel' : 'Send Message' }}
                        </button>
                    </div>
                </div>

                <div v-if="showMessageForm" class="mt-4">
                    <form @submit.prevent="sendMessage">
                        <div class="mb-3">
                            <textarea v-model="messageContent" class="form-control text-light" placeholder="Type your message..." rows="3"
                                :disabled="isSending"></textarea>
                        </div>
                        <button type="submit" class="btn btn-success" :disabled="isSending || !messageContent.trim()">
                            <span v-if="isSending" class="spinner-border spinner-border-sm" role="status"></span>
                            {{ isSending ? 'Sending...' : 'Send Message' }}
                        </button>
                    </form>
                </div>

                <div class="text-light" v-if="user.bio">
                    <h3 class="mb-1">About Me</h3>
                    <p  style="white-space: pre-wrap; color:beige">{{ user.bio }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    border-radius: 15px;
    border: none;
}

.form-control{
    color:#f8f9fa
}

.rounded-circle {
    border: 4px solid #f8f9fa;
}

.btn-primary {
    padding: 8px 20px;
    border-radius: 20px;
}

textarea {
    resize: none;
    border-radius: 10px;
}

.text-muted {
    color: #6c757d !important;
}
</style>