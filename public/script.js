/* =========================================
   GLOBAL VARIABLES
========================================= */

let allContacts = [];

let currentPage = 1;

const rowsPerPage = 5;

/* =========================================
   SHOW LOADER
========================================= */

function showLoader(){

    const loader = document.getElementById("loader");

    if(loader){

        loader.style.display = "flex";

    }

}

/* =========================================
   HIDE LOADER
========================================= */

function hideLoader(){

    const loader = document.getElementById("loader");

    if(loader){

        loader.style.display = "none";

    }

}

/* =========================================
   SHOW TOAST MESSAGE
========================================= */

function showToast(message){

    const toast = document.getElementById("toast");

    if(toast){

        toast.innerText = message;

        toast.style.display = "block";

        setTimeout(() => {

            toast.style.display = "none";

        },3000);

    }

}

/* =========================================
   CONTACT FORM
========================================= */

const contactForm = document.getElementById("contactForm");

if(contactForm){

    contactForm.addEventListener(
        "submit",
        async function(e){

            e.preventDefault();

            showLoader();

            try{

                const formData = new FormData();

                formData.append(
                    "name",
                    document.getElementById("name").value
                );

                formData.append(
                    "email",
                    document.getElementById("email").value
                );

                formData.append(
                    "message",
                    document.getElementById("messageField").value
                );

                const imageFile =
                document.getElementById("image").files[0];

                if(imageFile){

                    formData.append("image", imageFile);

                }

                const response = await fetch(
                    "http://localhost:3000/api/contact/create",
                    {
                        method:"POST",
                        body:formData
                    }
                );

                const data = await response.json();

                hideLoader();

                if(response.ok){

                    showToast(
                        "Message Sent Successfully"
                    );

                    contactForm.reset();

                }
                else{

                    showToast(
                        data.message || "Failed"
                    );

                }

            }
            catch(error){

                console.log(error);

                hideLoader();

                showToast("Server Error");

            }

        }
    );

}

/* =========================================
   REGISTER FORM
========================================= */

const registerForm =
document.getElementById("registerForm");

if(registerForm){

    registerForm.addEventListener(
        "submit",
        async function(e){

            e.preventDefault();

            try{

                const response = await fetch(
                    "http://localhost:3000/api/auth/register",
                    {
                        method:"POST",

                        headers:{
                            "Content-Type":"application/json"
                        },

                        body:JSON.stringify({

                            name:document.getElementById(
                                "registerName"
                            ).value,

                            email:document.getElementById(
                                "registerEmail"
                            ).value,

                            password:document.getElementById(
                                "registerPassword"
                            ).value

                        })

                    }
                );

                const data = await response.json();

                if(response.ok){

                    alert("Registration Successful");

                    window.location.href =
                    "login.html";

                }
                else{

                    alert(data.message);

                }

            }
            catch(error){

                console.log(error);

                alert("Server Error");

            }

        }
    );

}

/* =========================================
   LOGIN FORM
========================================= */

const loginForm =
document.getElementById("loginForm");

if(loginForm){

    loginForm.addEventListener(
        "submit",
        async function(e){

            e.preventDefault();

            try{

                const response = await fetch(
                    "http://localhost:3000/api/auth/login",
                    {
                        method:"POST",

                        headers:{
                            "Content-Type":"application/json"
                        },

                        body:JSON.stringify({

                            email:document.getElementById(
                                "loginEmail"
                            ).value,

                            password:document.getElementById(
                                "loginPassword"
                            ).value

                        })

                    }
                );

                const data = await response.json();

                if(response.ok){

                    localStorage.setItem(
                        "token",
                        data.token
                    );

                    alert("Login Successful");

                    window.location.href =
                    "admin.html";

                }
                else{

                    alert(data.message);

                }

            }
            catch(error){

                console.log(error);

                alert("Server Error");

            }

        }
    );

}

/* =========================================
   LOAD CONTACTS
========================================= */

async function loadContacts(){

    const tableBody =
    document.getElementById("tableBody");

    if(!tableBody){

        return;

    }

    showLoader();

    try{

        const response = await fetch(
            "http://localhost:3000/api/contact/all"
        );

        const contacts = await response.json();

        hideLoader();

        allContacts = contacts;

        /* DASHBOARD STATS */

        const totalContacts =
        document.getElementById(
            "totalContacts"
        );

        const totalMessages =
        document.getElementById(
            "totalMessages"
        );

        const totalImages =
        document.getElementById(
            "totalImages"
        );

        const totalUsers =
        document.getElementById(
            "totalUsers"
        );

        if(totalContacts){

            totalContacts.innerText =
            contacts.length;

        }

        if(totalMessages){

            totalMessages.innerText =
            contacts.length;

        }

        if(totalUsers){

            totalUsers.innerText =
            contacts.length;

        }

        if(totalImages){

            totalImages.innerText =
            contacts.filter(
                contact => contact.image
            ).length;

        }

        displayContacts(contacts);

        /* MESSAGE TABLE */

        const messageTable =
        document.getElementById(
            "messageTable"
        );

        if(messageTable){

            let messageRows = "";

            contacts.forEach(contact => {

                messageRows += `

                <tr>

                    <td>${contact.name}</td>

                    <td>${contact.message}</td>

                </tr>

                `;

            });

            messageTable.innerHTML =
            messageRows;

        }

        /* IMAGE GALLERY */

        const imageGallery =
        document.getElementById(
            "imageGallery"
        );

        if(imageGallery){

            let imageHTML = "";

            contacts.forEach(contact => {

                if(contact.image){

                    imageHTML += `

                    <img
                        src="/uploads/${contact.image}"
                        style="
                            width:140px;
                            height:140px;
                            object-fit:cover;
                            border-radius:12px;
                            margin:10px;
                        "
                    >

                    `;

                }

            });

            imageGallery.innerHTML =
            imageHTML;

        }

    }
    catch(error){

        console.log(error);

        hideLoader();

    }

}

/* =========================================
   DISPLAY CONTACTS
========================================= */

function displayContacts(data){

    const tableBody =
    document.getElementById("tableBody");

    if(!tableBody){

        return;

    }

    const start =
    (currentPage - 1) * rowsPerPage;

    const end =
    start + rowsPerPage;

    const contacts =
    data.slice(start,end);

    let rows = "";

    contacts.forEach(contact => {

        rows += `

        <tr>

            <td>${contact.name}</td>

            <td>${contact.email}</td>

            <td>${contact.message}</td>

            <td>

                ${
                    contact.image
                    ?
                    `<img
                        src="/uploads/${contact.image}"
                        width="80"
                        height="80"
                        style="
                            border-radius:10px;
                            object-fit:cover;
                        "
                    >`
                    :
                    "No Image"
                }

            </td>

            <td>

                ${
                    new Date(
                        contact.createdAt
                    ).toLocaleString()
                }

            </td>

            <td>

                <button
                    onclick="deleteContact('${contact._id}')"
                >

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

    tableBody.innerHTML = rows;

}

/* =========================================
   SEARCH CONTACTS
========================================= */

function searchContacts(){

    const value =
    document.getElementById(
        "searchInput"
    ).value.toLowerCase();

    const filtered =
    allContacts.filter(contact =>

        contact.name
        .toLowerCase()
        .includes(value)

    );

    displayContacts(filtered);

}

/* =========================================
   DELETE CONTACT
========================================= */

async function deleteContact(id){

    const confirmDelete =
    confirm(
        "Are you sure to delete?"
    );

    if(!confirmDelete){

        return;

    }

    try{

        await fetch(
            `http://localhost:3000/api/contact/delete/${id}`,
            {
                method:"DELETE"
            }
        );

        showToast(
            "Deleted Successfully"
        );

        loadContacts();

    }
    catch(error){

        console.log(error);

    }

}

/* =========================================
   PAGINATION
========================================= */

function nextPage(){

    const totalPages =
    Math.ceil(
        allContacts.length /
        rowsPerPage
    );

    if(currentPage < totalPages){

        currentPage++;

        document.getElementById(
            "pageNumber"
        ).innerText = currentPage;

        displayContacts(allContacts);

    }

}

function prevPage(){

    if(currentPage > 1){

        currentPage--;

        document.getElementById(
            "pageNumber"
        ).innerText = currentPage;

        displayContacts(allContacts);

    }

}

/* =========================================
   SHOW SECTIONS
========================================= */

function showSection(sectionId){

    const sections = [

        "dashboardSection",
        "contactsSection",
        "messagesSection",
        "imagesSection"

    ];

    sections.forEach(id => {

        const section =
        document.getElementById(id);

        if(section){

            section.style.display =
            "none";

        }

    });

    const activeSection =
    document.getElementById(sectionId);

    if(activeSection){

        activeSection.style.display =
        "block";

    }

}

/* =========================================
   DARK MODE
========================================= */

function toggleDarkMode(){

    document.body.classList.toggle(
        "dark-mode"
    );

}

/* =========================================
   LOGOUT
========================================= */

function logout(){

    localStorage.removeItem("token");

    window.location.href =
    "login.html";

}

/* =========================================
   SCROLL TO TOP
========================================= */

window.onscroll = function(){

    const topBtn =
    document.getElementById("topBtn");

    if(topBtn){

        if(
            document.body.scrollTop > 100 ||

            document.documentElement
            .scrollTop > 100
        ){

            topBtn.style.display =
            "block";

        }
        else{

            topBtn.style.display =
            "none";

        }

    }

};

function scrollToTop(){

    window.scrollTo({

        top:0,
        behavior:"smooth"

    });

}

/* =========================================
   ADMIN AUTH
========================================= */

if(
    window.location.pathname.includes(
        "admin.html"
    )
){

    const token =
    localStorage.getItem("token");

    if(!token){

        window.location.href =
        "login.html";

    }
    else{

        loadContacts();

    }

}