## Personal blog  - nodejs, express, mongodb, vue

### Step to run it

1. clone or download this repo
2. cd into the folder '..\myblog-nodejs-vue\server' and run command 'npm install'  
3. cd into the folder '..\myblog-nodejs-vue\client' and run command 'npm install', then run command 'npm run build'
4. open Chrome browser(or other browser) and goto http://localhost:8082
5. The test admin for login is:  
  username: test123  
  password: testonly   

### How to run it with your mongoDB
1. open app.js in '..\myblog-nodejs-vue\server\src'
2. find the line 'mongoose.connect('mongodb://testonly:test123@ds253889.mlab.com:53889/bilibilidata', { useNewUrlParser: true });' and replace the link with your mongodb uri  
3. in your mongoDB create a admin account inside the Collection: admins 

---
server run at port 8082  
frontend test at localhost:8080    