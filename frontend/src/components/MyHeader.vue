<template lang="html">
    <header>
        <img :src="require('../assets/logo.png')" alt="avatar" class="avatar">
        <div class="name"></div><br>
        <div class="denote">Major in Computer Science. </div>
        <br><br>
        <div class="navigator" align="center">
            <a href="#" @click="deletePost(post._id)"><u>Blog</u></a>&nbsp;
            <a href="#" @click="deletePost(post._id)"><u>Projects</u></a>&nbsp;
            <a href="#" @click="deletePost(post._id)"><u>About Me</u></a>
        </div>
    </header>
</template>



<style>
header {
    font-family:  Arial, Georgia;
}
.avatar {
    width:120px; 
    height:130px;
    border-radius:50%;    
}
.name {    
    font-size: 14px;
    font-weight: bold;
    color: #000;
}
.denote {
    font-size: 13px;
    color: #636363;
}
.navigator {
    text-decoration: none;
}
</style>