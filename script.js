var pageFuncs = {
    toggleDrawer: () =>
    {
        var drawer = document.getElementById("drawer");
        drawer.style.left = drawer.style.left == "0px" ? "-500px" : "0px";
    },
    emailSubmit: () =>
    {
        var emailInput = document.getElementById("emailUpdatesInput");
        console.log(emailInput.value);
        console.log(emailInput.checkValidity());

        var email = emailInput.value;
        if (email === "" || !emailInput.checkValidity())
        {
            alert("Please enter a valid email!");
            return;
        }

        emailInput.value = "";

        document.getElementById("submittedUpdates").style.display = "flex";
    }
};