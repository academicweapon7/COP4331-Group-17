const urlBase = 'http://cop4331-17.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	// collect values from form
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;

	// clear existing result message
	document.getElementById("loginResult").innerHTML = "";

	// JSON formatting
	let tmp = 
	{
		Login: login,
		Password: password
	};

	// data to send to server (body of HTTP request)
	let jsonPayload = JSON.stringify(tmp);
	
	// same steps as Postman
	let url = urlBase + '/Login.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		// event handler
		xhr.onreadystatechange = function() 
		{
			// complete and successful request
			if (this.readyState == 4 && this.status == 200) 
			{
				// response from server
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.ID;
		
				if (userId < 1)
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.FirstName;
				lastName = jsonObject.LastName;

				saveCookie();

				// takes user to next page
				window.location.href = "contacts.html";
			}
		};
		// sends HTTP request to server
		xhr.send(jsonPayload);
	}
	// handles exceptions during request execution
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doRegister()
{
	// collect values from form
	let firstName = document.getElementById("registerFirstName").value;
    let lastName = document.getElementById("registerLastName").value;
    let yachtRegistration = document.getElementById("registerYachtRegistration").value;
    let login = document.getElementById("registerLogin").value;
    let password = document.getElementById("registerPassword").value;

	// clear existing result message
	document.getElementById("registerResult").innerHTML = "";

    if (checkBlankFields(firstName, lastName, yachtRegistration, login, password)) 
	{
        document.getElementById("registerResult").innerHTML = "Please fill in all the registration fields";
        return;
    }

	if (!checkPasswordComplexity(password)) {
        document.getElementById("registerResult").innerHTML = "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character";
        return;
    }

	// JSON formatting
	let tmp = 
	{
        FirstName: firstName,
        LastName: lastName,
        YachtRegistration: yachtRegistration,
        Login: login,
        Password: password
    };

	// data to send to server (body of HTTP request)
	let jsonPayload = JSON.stringify(tmp);

	// same steps as Postman
    let url = urlBase + '/Register.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try 
	{
		// event handler
        xhr.onreadystatechange = function() 
		{
			// complete and successful request
            if (this.readyState == 4 && this.status == 200)
			{
				// response from server
                let response = JSON.parse(xhr.responseText);

				// username taken
                if (response.error)
                    document.getElementById("registerResult").innerHTML = response.error;
                else
                    document.getElementById("registerResult").innerHTML = "Registration successful. Please login";
            }
        };
		// sends HTTP request to server
        xhr.send(jsonPayload);
    } 
	// handles exceptions during request execution (network errors)
	catch (err) 
	{
        document.getElementById("registerResult").innerHTML = err.message;
    }
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	// collect values from form
	let firstName = document.getElementById("contactFirstName").value;
    let lastName = document.getElementById("contactLastName").value;
	let yachtName = document.getElementById("contactYachtName").value;
    let yachtSize = document.getElementById("contactYachtSize").value;
	let phone = document.getElementById("contactPhone").value;
    let email = document.getElementById("contactEmail").value;

	// clear existing result message
	document.getElementById("contactAddResult").innerHTML = "";

    if (checkBlankFields(firstName, lastName, yachtName, yachtSize, phone, email)) 
	{
        document.getElementById("contactAddResult").innerHTML = "Please fill in all the fields.";
        return;
    }

	if (!isValidPhoneNumber(phone)) 
	{
        document.getElementById("contactAddResult").innerHTML = "Please enter a valid phone number (numbers and/or dashes).";
        return;
    }

	if (!isValidEmail(email)) 
	{
        document.getElementById("contactAddResult").innerHTML = "Please enter a valid email address.";
        return;
    }

	// JSON formatting
	let tmp =
	{
		FirstName: firstName,
		LastName: lastName,
		YachtName: yachtName,
		YachtSize: yachtSize,
		Phone: phone,
		Email: email,
		UserID: userId
	};

	// data to send to server (body of HTTP request)
	let jsonPayload = JSON.stringify(tmp);
	
	// same steps as Postman
	let url = urlBase + '/Add.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		// event handler
		xhr.onreadystatechange = function() 
		{
			// complete and successful request
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
			else
			{
                document.getElementById("contactAddResult").innerHTML = "Error: " + xhr.responseText;
			}
		};
		// sends HTTP request to server
		xhr.send(jsonPayload);
	}
	// handles exceptions during request execution (network errors)
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

function searchContact() 
{
	readCookie();

	// collect value from form
    let searchInput = document.getElementById("searchText").value.trim();

	// clear existing result message
    document.getElementById("contactSearchResult").innerHTML = "";

    if (isEmpty(searchInput)) {
        document.getElementById("contactResults").innerHTML = "";
        document.getElementById("contactSearchResult").innerHTML = "Please enter a search term.";
        return;
    }

	// JSON formatting
    let tmp = 
	{
        Search: searchInput,
        UserID: userId
    };

	// data to send to server (body of HTTP request)
    let jsonPayload = JSON.stringify(tmp);

	// same steps as Postman
    let url = urlBase + '/SearchContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try 
	{
		// event handler
        xhr.onreadystatechange = function() 
		{
			// complete and successful request
            if (this.readyState == 4 && this.status == 200) 
			{
				// response from server
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error === "") 
				{
                    let contactResults = jsonObject.results;

                    if (contactResults.length > 0) 
					{
                        let contactList = "";

                        for (let i = 0; i < contactResults.length; i++) 
						{
                            let contact = contactResults[i];

                            // formatting list of contacts
                            contactList += "First Name: " + contact.FirstName + "<br />";
                            contactList += "Last Name: " + contact.LastName + "<br />";
                            contactList += "Phone: " + contact.Phone + "<br />";
                            contactList += "Email: " + contact.Email + "<br />";
                            contactList += "Yacht Name: " + contact.YachtName + "<br />";
							contactList += "Yacht Size: " + contact.YachtSize + "<br /><br />";

							
							// select button
							contactList += "<button onclick='selectContact(" + contact.ID + ")'>Select</button><br /><br />";

                        }
						// show list of contacts
                        document.getElementById("contactResults").innerHTML = contactList;
                        document.getElementById("contactSearchResult").innerHTML = "Contacts retrieved.";
                    } 
					else 
					{
						// clear previous contact results
                        document.getElementById("contactResults").innerHTML = "";
                        document.getElementById("contactSearchResult").innerHTML = "No matching contacts found.";
                    }
                } 
				else 
				{
					// clear previous contact results
                    document.getElementById("contactResults").innerHTML = "";
                    document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
                }
            }
        };
		// sends HTTP request to server
        xhr.send(jsonPayload);
    } 
	// handles exceptions during request execution (network errors)
	catch (err) 
	{
        document.getElementById("contactSearchResult").innerHTML = err.m
	}
}

// *** not functional ***
function deleteContact() 
{
    // collect value from form
    let contactId = document.getElementById("deleteContactId").value;

	// clear existing result message
	document.getElementById("deleteResult").innerHTML = "";
    
    // *** change me ***
    if (contactId.trim() === "") {
        alert("Please enter a contact ID.");
        return;
    }

    let confirmation = confirm("Are you sure you want to delete contact with ID " + contactId + "?");
    
    if (confirmation) 
	{
        // JSON formatting
        let tmp = {
            ID: contactId
        };

        let jsonPayload = JSON.stringify(tmp);

        // same steps as Postman
        let url = urlBase + '/Delete.' + extension;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        xhr.onreadystatechange = function() 
		{
            if (this.readyState == 4) 
			{
                if (this.status == 200) 
				{
                    alert("Contact with ID " + contactId + " deleted successfully.");
                } 
				else 
				{
                    alert("Error deleting contact.");
                }
            }
        };
        // sends HTTP request to server
        xhr.send(jsonPayload);
    }
}

// helper functions

function isEmpty(value) 
{
    return value.trim() === "";
}


function checkPasswordComplexity(password) 
{
	let uppercaseRegex = /[A-Z]/;
    let lowercaseRegex = /[a-z]/;
    let specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    return password.length >= 8 &&
        uppercaseRegex.test(password) &&
        lowercaseRegex.test(password) &&
        specialCharacterRegex.test(password);
}

function checkBlankFields(...fields) 
{
    for (let field of fields) 
	{
        if (isEmpty(field)) 
		{
            return true; // at least one field is empty
        }
    }
    return false; // no fields are empty
}

function isValidEmail(email) 
{
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhoneNumber(phone) 
{
    let phoneRegex = /^[\d\-]+$/;
    return phoneRegex.test(phone);
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");

	for (var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");

		if (tokens[0] == "firstName")
		{
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName")
		{
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId")
		{
			userId = parseInt(tokens[1].trim());
		}
	}
	
	if (userId < 0)
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function showAddContactForm() 
{
   var modal = document.getElementById("addContactModal");
   modal.style.display = "block";
}

function closeAddContactForm() 
{
    document.getElementById("addContactModal").style.display = "none";
}

function handleKeyPress(event) 
{
	if (event.keyCode === 13) 
	{
		searchContact();
	}
}

function selectContact(ID) 
{
	console.log("Selected ID: " + ID);
	document.getElementById("selectedID").value = ID;
}
