firebase.apps.length ? firebase.app() : firebase.initializeApp({
    apiKey: "AIzaSyCsd32-j0I-zHAI4l2k1jLDLE57fEkrn5w",
    authDomain: "civichackathonproject.firebaseapp.com",
    projectId: "civichackathonproject",
    storageBucket: "civichackathonproject.appspot.com",
    messagingSenderId: "818629897434",
    appId: "1:818629897434:web:92535cbfa5715a366289e3"
});

var db = firebase.database();
var auth = firebase.auth();

//just to test
var ref = db.ref("test/aasf/as/gas/g/d/sa")


var signInButtonClicked = async () => {
    var emailInput = document.getElementById("emailInput");
    var passwordInput = document.getElementById("passwordInput");

    var email = emailInput.value;
    var password = passwordInput.value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        console.log(error);
        showLoginAlert(error.message);
        return;
    }

    clear();

    showLoginAlert("Logged in! (You should be navigated to a new page soon. If you are not, there is an error with your account.)", true);
}

var showLoginAlert = (a, good) => {
    var e = document.getElementById("loginErrorMsg");
    if (a === "") {
        e.style.display = "none";
    }
    e.innerHTML = a;
    e.style.display = "block";
    e.style.color = good ? "green" : "red";
}



var signUpButtonClicked = async () => {
    var emailInput = document.getElementById("signUpEmailInput");
    var passwordInput = document.getElementById("signUpPasswordInput");
    var confirmPasswordInput = document.getElementById("signUpPasswordConfirmInput");

    var email = emailInput.value;
    var password = passwordInput.value;
    var confirmPassword = confirmPasswordInput.value;

    if (password != confirmPassword) {
        console.log("passwords dont match");
        showSignUpAlert("Passwords do not match.");
        return;
    }

    try {
        await auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
        console.log(error);
        showSignUpAlert(error.message);
        return;
    }

    clear();

    var roleInput = document.getElementById("signUpRoleInput");
    var role = roleInput.value;

    createNewUserInDb(email, role, auth.currentUser.uid, () => {
        showSignUpAlert("Account created successfully!", true);
    })
}

var showSignUpAlert = (a, good) => {
    var e = document.getElementById("signUpErrorMsg");
    if (a === "") {
        e.style.display = "none";
    }
    e.innerHTML = a;
    e.style.display = "block";
    e.style.color = good ? "green" : "red";
}



var clear = () => {
    var inputs = [
        document.getElementById("emailInput"),
        document.getElementById("passwordInput"),
        document.getElementById("signUpEmailInput"),
        document.getElementById("signUpPasswordInput"),
        document.getElementById("signUpPasswordConfirmInput")
    ]

    for (var i in inputs) {
        inputs[i].value = "";
    }

    showSignUpAlert("");
    showLoginAlert("");
}


createNewUserInDb = async (email, role, uid, callback) => {
    var usersRef = db.ref("users");
    var user = {};
    user[uid] = {
        email: email,
        role: role
    };
    await usersRef.update(user);
    callback();
}



//checking if signed in
auth.onAuthStateChanged((a) => {
    console.log("user", a);
    if (a) {
        console.log("user is signed in");

        if (location.href.indexOf("login") === -1) {
            return;
        }

        db.ref("users/" + auth.currentUser.uid).once("value", (data) => {
            if (!data.exists()) {
                alert("There is an error with your account. Please contact raysofhopeteam1@gmail.com to fix this.");
                auth.signOut();
                return;
            }

            var v = data.val()

            console.log(v);

            console.log(v.role);

            location = v.role + "Page.html";
        })
    }
    else {
        if (location.href.indexOf("login") === -1) {
            location = "login.html";
        }
        console.log("user is not signed in");
    }
})


submitOpp = (o) => {
    if (o == 0) {
        console.log("submit a job opportunity");

        var jobNameInput = document.getElementById("oppJobNameInput");
        var companyInput = document.getElementById("oppCompanyInput");
        var stateInput = document.getElementById("oppStateInput");
        var emailInput = document.getElementById("oppEmailInput");

        var ref = db.ref("jofs/opp/");
        ref.push({
            jobName: jobNameInput.value,
            company: companyInput.value,
            state: stateInput.value,
            email: emailInput.value,
            time: firebase.database.ServerValue.TIMESTAMP
        })
    }
    else if (o == 1) {
        console.log("submit a financial support opportunity");

        var companyInput = document.getElementById("finCompanyInput");
        var stateInput = document.getElementById("finStateInput");
        var descInput = document.getElementById("finDescInput");
        var emailInput = document.getElementById("finEmailInput");

        var ref = db.ref("jofs/fin/");
        ref.push({
            company: companyInput.value,
            state: stateInput.value,
            desc: descInput.value,
            email: emailInput.value,
            time: firebase.database.ServerValue.TIMESTAMP
        })
    }
}


getOpps = () =>
{
    try {
        clearOppElements();
    } catch (error) {}

    var jobRef = db.ref("jofs/opp").orderByChild("time");
    var finRef = db.ref("jofs/fin").orderByChild("time");

    jobRef.once("value", (data) => {
        var jobOpp = data.val();
        var l = [];
        for (var j in jobOpp)
        {
            l.push({
                ...jobOpp[j],
                id: j
            });
        }

        setJobData(l);
    });

    finRef.once("value", (data) => {
        var finOpp = data.val();
        var l = [];
        for (var f in finOpp)
        {
            l.push({
                ...finOpp[f],
                id: f
            });
        }

        setFinData(l);
    });
}

clearOppElements = () =>
{
    var jobE = document.getElementById("availJob").children;
    console.log(jobE);
    for (var i in jobE)
    {
        if (jobE[i].id == "jobTemplate")
        {
            continue;
        }

        jobE[i].remove();
    }

    var jobE = document.getElementById("availFin").children;
    console.log(jobE);
    for (var i in jobE)
    {
        if (jobE[i].id == "finTemplate")
        {
            continue;
        }

        jobE[i].remove();
    }
}

getOpps();

setJobData = (d) =>
{
    var template = document.getElementById("jobTemplate");

    for (var j in d)
    {
        var n = template.cloneNode(true);
        n.id = d[j].id;
        template.parentElement.appendChild(n);
        n.getElementsByClassName("oneJobNameTxt").item(0).innerHTML = d[j].jobName;
        n.getElementsByClassName("oneJobCompanyTxt").item(0).innerHTML = d[j].company;
        n.getElementsByClassName("oneJobStateTxt").item(0).innerHTML = d[j].state;
        n.getElementsByClassName("oneJobEmailTxt").item(0).innerHTML = d[j].email;
    }
}


setFinData = (d) =>
{
    var template = document.getElementById("finTemplate");

    for (var j in d)
    {
        var n = template.cloneNode(true);
        n.id = d[j].id;
        template.parentElement.appendChild(n);
        n.getElementsByClassName("oneFinCompanyTxt").item(0).innerHTML = d[j].company;
        n.getElementsByClassName("oneFinDescTxt").item(0).innerHTML = d[j].desc;
        n.getElementsByClassName("oneFinStateTxt").item(0).innerHTML = d[j].state;
        n.getElementsByClassName("oneFinEmailTxt").item(0).innerHTML = d[j].email;
    }
}