<script setup>
    /*  eslint-disable */
    import { db } from '@/firebase/firebase-config'
    import { doc, getDoc, serverTimestamp } from 'firebase/firestore'
    import {ref} from 'vue'
    import { useRoute } from 'vue-router'
    import LoadingSpinner from './LoadingSpinner.vue'

    const emit = defineEmits(['editPost','cancel'])
    const isLoading = ref(true)
    const route = useRoute()
    const props = defineProps({
        objectiveId : {
            type: String,
        }
    })

    const name_input = ref('')
    const status_input = ref('')
    const UserId = ref('')


    const emitPost = ()=>{
        if (name_input.value && status_input.value){
            const newObj = {
                name: name_input.value,
                status: status_input.value,
                createdAt: serverTimestamp()
            }
            emit('editPost', newObj)
        }
    }

    const objective = ref({})
    const getObjective = async ()=>{
        UserId.value = route.params.uid;
        console.log(UserId.value,props.objectiveId )
        const SnapShot = await getDoc(doc(db, "users", UserId.value, "objectives", props.objectiveId))
        objective.value = SnapShot.data()
        name_input.value = objective.value.name
        status_input.value = objective.value.status
        isLoading.value = false
    }
    getObjective();

</script>

<template>
    <div>
        <div class="modal-overlay" @click.self="$emit('cancel')">
            <div class="modal-content">
                <div class="modal-header">
                    <h1><i class="bi bi-plus-circle me-2"></i>Edit Task</h1>
                    <button class="close-btn" @click="$emit('cancel')">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div v-if="isLoading"><LoadingSpinner/></div>
                    <form v-else>
                        <div class="form-group">
                            <label>Name: </label>
                            <input v-model="name_input" type="text" placeholder="Enter objective name">
                        </div>
                        <div class="form-group">
                            <label>Status: </label>
                            <select v-model="status_input">
                                <option value="not Started">Not Started</option>
                                <option value="in Progress">In Progress</option>
                                <option value="complete">Done</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="cancel-btn" @click="$emit('cancel')">Cancel</button>
                    <button class="submit-btn" @click="emitPost">Edit Objective</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(3px);
    }

    .modal-content {
        background-color: #1e1e1e;
        width: 500px;
        max-width: 90%;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 0 25px rgba(210, 117, 255, 0.6);
        color: #e0e0e0;
        animation: modal-appear 0.3s ease-out;
    }

    @keyframes modal-appear {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .modal-header {
        background-color: #4834d4;
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-header h1 {
        color: white;
        font-size: 1.2rem;
        margin: 0;
        font-weight: bold;
    }

    .close-btn {
        background: transparent;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        transition: background-color 0.2s;
    }

    .close-btn:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }

    .modal-body {
        padding: 20px;
    }

    .form-group {
        margin-bottom: 20px;
    }

    label {
        display: block;
        margin-bottom: 8px;
        font-weight: bold;
        color: #d0d0d0;
    }

    input, select {
        width: 100%;
        padding: 10px 12px;
        border-radius: 6px;
        border: 1px solid #444;
        background-color: #2a2a2a;
        color: #e0e0e0;
        font-size: 1rem;
        transition: border-color 0.3s, box-shadow 0.3s;
    }

    input:focus, select:focus {
        outline: none;
        border-color: #d275ff;
        box-shadow: 0 0 8px rgba(210, 117, 255, 0.4);
    }

    input::placeholder {
        color: #666;
    }

    .modal-footer {
        padding: 15px 20px;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        border-top: 1px solid #333;
    }

    button {
        padding: 10px 16px;
        border-radius: 6px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .cancel-btn {
        background-color: transparent;
        border: 1px solid #666;
        color: #e0e0e0;
    }

    .submit-btn {
        background-color: #d275ff;
        border: none;
        color: #1e1e1e;
    }

    .cancel-btn:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .submit-btn:hover {
        background-color: #e19fff;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(210, 117, 255, 0.3);
    }

    /* Add Bootstrap Icons if not already imported */
    @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css");
</style>