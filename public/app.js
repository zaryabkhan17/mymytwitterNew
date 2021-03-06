const url = "https://own-project.herokuapp.com";//////////////////////////////
// const url = "http://localhost:5000";

// var url = "http://localhost:5000";
var socket = io(url);

socket.on('connect', function () {
    console.log("connected");
});
function signUp() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value.toLowerCase();
    var phone = document.getElementById("phone").value;
    var password = document.getElementById("password").value;

    let user = {
        name: name,
        email: email,
        phone: phone,
        password: password
    }


    const Http = new XMLHttpRequest();
    Http.open("POST", url + "/auth/signup");
    Http.setRequestHeader("Content-Type", "application/json");
    Http.send(JSON.stringify(user));

    Http.onreadystatechange = (e) => {

        if (Http.readyState === 4) {
            let jsonRes = JSON.parse(Http.responseText)
            if (Http.status === 200) {
                alert(jsonRes.message);
                window.location.href = "login.html";
            }
            else {
                alert(jsonRes.message);
            }

        }
    }
    return false;


  
}

function logIn() {

    var email = document.getElementById("email").value.toLowerCase();
    var password = document.getElementById("password").value;

    user = {
        email: email,
        password: password,
    }

    const Http = new XMLHttpRequest();
    Http.open("POST", url + "/auth/login");
    Http.setRequestHeader("Content-Type", "application/json");
    Http.send(JSON.stringify(user));

    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4) {
            let jsonRes = JSON.parse(Http.responseText);
            

            if (Http.status === 200) {
                alert(jsonRes.message);
                localStorage.setItem('current_user', JSON.stringify(jsonRes.user))
                window.location.href = "dashboard.html";
            }
            else {
                alert(jsonRes.message);
            }

        }
    }
    return false;
}

function getProfile() {
   
    axios({

        method: 'get',
        url: url + "/profile",

    }).then((response) => {
        
        document.getElementById('resUserName').innerHTML = response.data.profile.name;       
        getTweets();
    }, (error) => {
        
        window.location.href = "./login.html"
       
    });

}

const tweetme = () => {


    const Http = new XMLHttpRequest();
    Http.open("POST", url + "/uploadTweet")
    Http.setRequestHeader("Content-Type", "application/json");
    Http.send(JSON.stringify({
        userPost: document.getElementById("userPost").value,
    }))


    document.getElementById("userPost").value = "";

}
socket.on("NEW_POST", (newPost) => {


    // console.log("newPost  ", newPost.profileUrl);
    var eachTweet = document.createElement("li");
    eachTweet.setAttribute("class", "myClass");
    eachTweet.innerHTML =

        `
        <img src="${newPost.profileUrl}" alt="Avatar" class="avatar">
        <h4 class="userName">
        ${newPost.data.name}
    </h4> 
    <p class="userPost">
        ${newPost.data.userPost}
    </p>`;
    // console.log(`User: ${tweets[i]} ${tweets[i].userPosts[j]}`)
    document.getElementById("posts").appendChild(eachTweet)
})


const userTweets = () => {
    document.getElementById("posts").innerHTML = "";
    const Http = new XMLHttpRequest();
    Http.open("GET", url + "/userTweets");
    Http.send();
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4) {
            let jsonRes = JSON.parse(Http.responseText)
            // console.log(jsonRes);
            for (let i = 0; i < jsonRes.tweets.length; i++) {

                var eachTweet = document.createElement("li");
                eachTweet.setAttribute("class", "myClass");

                eachTweet.innerHTML =
                    `
                    <img src="${jsonRes.tweets[i].profileUrl}" alt="Avatar" class="avatar"> 
                    <h4 class="userName">
                    ${jsonRes.tweets[i].name}
                </h4> 
            
                <p class="userPost">
                    ${jsonRes.tweets[i].userPost}
                </p>`;

                // console.log(`User: ${tweets[i]} ${tweets[i].userPosts[j]}`)
                document.getElementById("posts").appendChild(eachTweet)

            }
        }
    }
}




const getTweets = () => {

    document.getElementById("posts").innerHTML = "";

    const Http = new XMLHttpRequest();
    Http.open("GET", url + "/getTweets");
    Http.send();
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4) {

            let data = JSON.parse((Http.responseText));
            // console.log(data);
            for (let i = 0; i < data.tweets.length; i++) {
                // console.log("tweets are = > ", data.tweets[i]);
                // console.log("tweets are = > ", data.tweets[i]);
                // console.log(`this is ${i} tweet = ${data.tweets[i].createdOn}`);
                // console.log("tweets=>" , data.tweets[i].profileUrl);
                var eachTweet = document.createElement("li");
                eachTweet.setAttribute("class", "myClass");
                eachTweet.innerHTML =
                    `
                    <img src="${data.tweets[i].profileUrl}" alt="profile" class="avatar">                    
                    <h4 class="userName">
                    ${data.tweets[i].name}
                </h4> 
                <p class="userPost">
                    ${data.tweets[i].userPost}
                </p>`;
                // console.log(`User: ${tweets[i]} ${tweets[i].userPosts[j]}`)
                document.getElementById("posts").appendChild(eachTweet)

            }
        }
    }
}




function passForgot() {

    // console.log("hggjghgh")

    axios({
        method: 'post',
        url: url + "/auth/forgot-password",
        // email : document.getElementById("email").value,

        data: {
            email: document.getElementById("email").value,
        }
    }).then((response) => {
        document.getElementById("forgotPassRes").style.display = "initial";
        document.getElementById("forgotPassRes").innerHTML = JSON.stringify(response.message);
        alert((response.message));
        localStorage.setItem("forgot_email", document.getElementById("email").value);
        window.location.href = "forgot_password_sterp_2.html";
    }, (error) => {
        console.log(error);
    });
    return false;
}



function newPassword() {

    // console.log("hdjfahfj")


    const Http = new XMLHttpRequest();
    Http.open("POST", url + "/auth/forgot-password-step-2")
    Http.setRequestHeader("Content-Type", "application/json");
    Http.send(JSON.stringify({
        email: document.getElementById("email").value.toLowerCase(),
        newPassword: document.getElementById("newPassword").value,
        otp: document.getElementById("otp").value,
    }))
    Http.onreadystatechange = (e) => {
        // console.log(Http.readyState);

        if (Http.readyState === 4) {
            alert(Http.responseText);
        }

    }

    return false;

}

function logout() {
    // let logout = () => {

    axios({
        method: "post",
        url: url + "/auth/logout",
    }).then((response) => {
        alert(response.data);
        window.location.href = "login.html";
    })
}