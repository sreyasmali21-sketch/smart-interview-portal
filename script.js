// ==============================
// Global Variable
// ==============================

let answers = [];

// ==============================
// Register User
// ==============================

function registerUser(){

const user={

name:document.getElementById("name").value,

email:document.getElementById("email").value,

password:document.getElementById("password").value

};

fetch("http://localhost:5000/register",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(user)

})

.then(res=>res.text())

.then(data=>alert(data));

}

// ==============================
// Login User
// ==============================
function loginUser(){

const user={

email:document.getElementById("loginEmail").value,

password:document.getElementById("loginPassword").value

};

fetch("http://localhost:5000/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(user)

})

.then(res=>res.text())

.then(data=>{

alert(data);

if(data=="Login Successful"){

localStorage.setItem("email",user.email);

window.location="dashboard.html";

}

});

}
function registerUser(){

const user={

name:document.getElementById("name").value,

email:document.getElementById("email").value,

password:document.getElementById("password").value

};

fetch("http://localhost:5000/register",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(user)

})

.then(res=>res.text())

.then(data=>{

alert(data);

});

}
// ==============================
// Add Question
// ==============================

function addQuestion(){

const question={

question:document.getElementById("question").value,

answer:document.getElementById("answer").value,

category:document.getElementById("category").value

};

fetch("http://localhost:5000/question",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(question)

})

.then(res=>res.text())

.then(data=>{

alert(data);

loadQuestions();

});

}

// ==============================
// View Questions
// ==============================

function loadQuestions(){

fetch("http://localhost:5000/question")

.then(res=>res.json())

.then(data=>{

let output="";

data.forEach(item=>{

output+=`

<div class="card">

<h3>${item.question}</h3>

<p>${item.answer}</p>

<b>${item.category}</b>

<br><br>

<button onclick="updateQuestion(${item.id})">
Update
</button>

<button onclick="deleteQuestion(${item.id})">
Delete
</button>

</div>

`;

});

const div=document.getElementById("result");

if(div){

div.innerHTML=output;

}

});

}

// ==============================
// Search Question
// ==============================

function searchQuestion(){

const category=document.getElementById("search").value;

fetch("http://localhost:5000/search/"+category)

.then(res=>res.json())

.then(data=>{

let output="";

data.forEach(item=>{

output+=`

<div class="card">

<h3>${item.question}</h3>

<p>${item.answer}</p>

<b>${item.category}</b>

</div>

`;

});

document.getElementById("result").innerHTML=output;

});

}

// ==============================
// Delete Question
// ==============================

function deleteQuestion(id){

fetch("http://localhost:5000/question/"+id,{

method:"DELETE"

})

.then(res=>res.text())

.then(data=>{

alert(data);

loadQuestions();

});

}

// ==============================
// Update Question
// ==============================

function updateQuestion(id){

const newAnswer=prompt("Enter New Answer");

if(!newAnswer){

return;

}

fetch("http://localhost:5000/update/"+id,{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

answer:newAnswer

})

})

.then(res=>res.text())

.then(data=>{

alert(data);

loadQuestions();

});

}

// ==============================
// Dashboard
// ==============================

function loadDashboard(){

fetch("http://localhost:5000/dashboard")

.then(res=>res.json())

.then(data=>{

if(document.getElementById("questionsCount")){

document.getElementById("questionsCount").innerHTML=data.totalQuestions;

}

if(document.getElementById("users")){

document.getElementById("users").innerHTML=data.totalUsers;

}

});

}

// ==============================
// Load Mock Test
// ==============================

function loadTest(){

const language=document.getElementById("language").value;

fetch("http://localhost:5000/test/"+language)

.then(res=>res.json())

.then(data=>{

answers=data;

let output="";

data.forEach((item,index)=>{

output+=`

<div class="card">

<h3>Q${index+1}. ${item.question}</h3>

<input

type="text"

id="ans${index}"

placeholder="Your Answer">

</div>

`;

});

document.getElementById("questions").innerHTML=output;

});

}

// ==============================
// Submit Test
// ==============================

function submitTest(){

let score=0;

answers.forEach((item,index)=>{

const userAnswer=document.getElementById("ans"+index).value;

if(

userAnswer.trim().toLowerCase()==

item.answer.trim().toLowerCase()

){

score++;

}

});

let wrong=answers.length-score;

document.getElementById("result").innerHTML=`

<div class="card">

<h2>Interview Result</h2>

<h3>Total Questions : ${answers.length}</h3>

<h3>Correct : ${score}</h3>

<h3>Wrong : ${wrong}</h3>

<h3>Percentage : ${((score/answers.length)*100).toFixed(2)}%</h3>

</div>

`;

}

// ==============================
// Start Interview
// ==============================

function startInterview(){

window.location="questions.html";

}

// ==============================
// Auto Load
// ==============================

window.onload=function(){

if(document.getElementById("result")){

loadQuestions();

}

if(document.getElementById("questionsCount")){

loadDashboard();

}

};