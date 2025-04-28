<script setup>
    /* eslint-disable */
    import { defineProps } from 'vue';
    const props = defineProps({
        objective : {
            type: Object,
        }
    }) 


    const getStatusIcon = (status) => {
        switch(status.toLowerCase()) {
            case 'complete':
                return 'bi bi-check-circle-fill text-success me-2';
            case 'in progress':
                return 'bi bi-hourglass-split text-warning me-2';
            case 'not started':
            default:
                return 'bi bi-circle text-secondary me-2';
        }
    };
</script>

<template>
    <div class="objective_card">
        <div class="card-header">
            <i class="bi bi-bullseye me-2"></i>Objective
        </div>
        <div class="card-body">
            <div class="objective-item">
                <i :class="getStatusIcon(props.objective.status)"></i>
                <span>{{ props.objective.name }}</span>
            </div>
            <div class="meta-info">
                <span class="status">{{ props.objective.status }}</span>
                <button class="edit-button">
                    <i class="bi bi-pencil-fill"></i> Edit
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.objective_card {
    border: none;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
    margin-bottom: 20px;
}

.objective_card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 20px rgba(162, 16, 238, 0.3);
}

.card-header {
    background-color: #4834d4;
    color: white;
    padding: 15px;
    font-size: 1.1rem;
    font-weight: bold;
}

.card-body {
    background-color: #1e1e1e;
    color: #e0e0e0;
    padding: 15px;
}

.objective-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.meta-info {
    padding-top: 10px;
    border-top: 1px solid #333;
    font-size: 0.85rem;
    color: #bbb;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.status {
    font-style: italic;
}

.edit-button {
    background-color: transparent;
    color: #d275ff;
    border: 1px solid #d275ff;
    border-radius: 5px;
    padding: 4px 10px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 5px;
}

.edit-button:hover {
    background-color: #d275ff;
    color: #1e1e1e;
    box-shadow: 0 0 10px rgba(210, 117, 255, 0.5);
}
</style>