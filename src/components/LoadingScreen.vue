<template>
    <div class="min-vh-100  page" style="background-color: #242424;">
        <img id="logo" src="../assets/logo.png" style="width: 100px;">
    </div>
</template>

<style scoped>
.page{
    display: flex;
    justify-content: center;
    align-items: center;
}

#logo{
    animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
    0%{
        transform: scale(1);
    }
    50%{
        transform: scale(1.25);
    }
    100%{
        transform: scale(1);
    }
}

</style>




