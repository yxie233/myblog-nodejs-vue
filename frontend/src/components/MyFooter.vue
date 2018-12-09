<template lang="html">
    <footer>
        <p class="line-title">
         <span class="line"></span><span class="title">contact</span>
        </p>
        <div class="links">
            <font color="black">Github: </font><a href="https://github.com/yxie233"><u>yxie233</u></a>
            <br>
            <font color="#1874CD">Facebook: </font><a href="https://github.com/yxie233"><u>@yiyun xie</u></a>
            <br>
            <font color="red">Linkedin: </font><a href="https://github.com/yxie233"><u>@yiyun xie</u></a>
            <br>
            <font color="#228B22">Email: </font><a href="https://github.com/yxie233"><u>xiey233@gmail.com</u></a>
        </div>
        <p>©2018-2019</p>
    </footer>
</template>


<style scoped>   
footer {
    width: 100%;
    padding: 0 0px;   
    max-width: 640px;
    margin: 0 auto;
    padding-bottom: 5px;  
    text-align: center;       
    justify-content: center;
    align-items: center;        
    font-size: 14px;
}

a:hover {color:#CC3300;text-decoration:none;}

font {
    font-weight: bold;
}
.links {
    text-align: left; 
    padding: 3px;
}
.line-title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}
.line-title .title {
  text-decoration: none;
  text-transform: uppercase;
  font-weight: bold;
  top: 0px;
  padding: 0 10px;
  color: #999;
  background-color: white;
}
.line-title .title::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 1px;
  background-color: #999;
}
</style>