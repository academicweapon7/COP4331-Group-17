const urlBase = 'http://cop4331-17.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let selectedId = 0;
let clickCount = 0;
let firstName = "";
let lastName = "";
let selectedFirstName = "";
let selectedLastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	// collect values from form
	let login = document.getElementById("loginUsername").value;
	let password = document.getElementById("loginPassword").value;

	// clear existing result message
	document.getElementById("doLoginResult").innerHTML = "";

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
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.ID;
		
				if (userId < 1)
				{		
					document.getElementById("doLoginResult").innerHTML = "User/Password combination incorrect";
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
		document.getElementById("doLoginResult").innerHTML = err.message;
	}
}

function doRegister()
{
	// collect values from form
	let firstName = document.getElementById("registerFirstName").value;
    let lastName = document.getElementById("registerLastName").value;
    let yachtRegistration = document.getElementById("registerYachtRegistration").value;
    let username = document.getElementById("registerUsername").value;
    let password = document.getElementById("registerPassword").value;
	let confirmPassword = document.getElementById("registerConfirmPassword").value;


	// clear existing result message
	document.getElementById("doRegisterResult").innerHTML = "";

    if (checkBlankFields(firstName, lastName, yachtRegistration, username, password)) 
	{
        document.getElementById("doRegisterResult").innerHTML = "Please fill in all the registration fields";
        return;
    }

	if (!checkPasswordComplexity(password)) {
        document.getElementById("doRegisterResult").innerHTML = "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character";
        return;
    }

	if (password !== confirmPassword)
	{
        document.getElementById("doRegisterResult").innerHTML = "Password does not match";
        return;		
	}

	// JSON formatting
	let tmp = 
	{
        FirstName: firstName,
        LastName: lastName,
        YachtRegistration: yachtRegistration,
        Login: username,
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
                    document.getElementById("doRegisterResult").innerHTML = response.error;
                else
                    document.getElementById("doRegisterResult").innerHTML = "Registration successful. Please login";
            }
        };
		// sends HTTP request to server
        xhr.send(jsonPayload);
    } 
	// handles exceptions during request execution (network errors)
	catch (err) 
	{
        document.getElementById("doRegisterResult").innerHTML = err.message;
    }
}

// *** add some document messages ***
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
	readCookie();

	// collect values from form
	let firstName = document.getElementById("contactFirstName").value;
    let lastName = document.getElementById("contactLastName").value;
	let yachtName = document.getElementById("contactYachtName").value;
    let yachtSize = document.getElementById("contactYachtSize").value;
	let phone = document.getElementById("contactPhone").value;
    let email = document.getElementById("contactEmail").value;

	// clear existing result message
	document.getElementById("addContactResult").innerHTML = "";

    if (checkBlankFields(firstName, lastName, yachtName, yachtSize, phone, email)) 
	{
        document.getElementById("addContactResult").innerHTML = "Please fill in all the fields";
        return;
    }

	if (!isValidPhoneNumber(phone)) 
	{
        document.getElementById("addContactResult").innerHTML = "Please enter a valid phone number (numbers and/or dashes)";
        return;
    }

	if (!isValidEmail(email)) 
	{
        document.getElementById("addContactResult").innerHTML = "Please enter a valid email address";
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
				document.getElementById("addContactResult").innerHTML = "Contact has been added";
			}
			else
			{
                document.getElementById("addContactResult").innerHTML = "Error: " + xhr.responseText;
			}
			
			searchContact();
		};
		// sends HTTP request to server
		xhr.send(jsonPayload);
	}
	// handles exceptions during request execution (network errors)
	catch(err)
	{
		document.getElementById("addContactResult").innerHTML = err.message;
	}
	
}

function searchContact() 
{
	readCookie();

	selectedId = 0;
    selectedFirstName = "";
    selectedLastName = "";
	document.getElementById("deleteButton").style.display = "none";

	// collect value from form
    let searchText = document.getElementById("searchText").value.trim();

	// clear existing result message
    document.getElementById("searchContactResult").innerHTML = "";

	// JSON formatting
    let tmp = 
	{
        Search: searchText,
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
                    let contactResult = jsonObject.results;

                    let contactList = "<table>";

                    for (let i = 0; i < contactResult.length; i++) 
					{
                        let contact = contactResult[i];

                        // formatting list of contacts
						contactList += "<tr>";

        				contactList += "<td>" + contact.FirstName + "</td>"; 
        				contactList += "<td>" + contact.LastName + "</td>"; 
       					contactList += "<td>" + contact.YachtName + "</td>"; 
        				contactList += "<td>" + contact.YachtSize + "</td>"; 
    					contactList += "<td>" + contact.Phone + "</td>"; 
    					contactList += "<td>" + contact.Email + "</td>";        					
						contactList += "<td><button class='select-button' data-contact-id='" + contact.ID + "' onclick='selectContact(\"" + contact.ID + "\", \"" + contact.FirstName + "\", \"" + contact.LastName + "\")'>Select</button></td>";

						contactList += "</tr>";
					}

					contactList += "</table>";

					// show list of contacts
                    document.getElementById("searchContactResult").innerHTML = contactList; 
                } 
				else 
				{
                    document.getElementById("searchContactResult").innerHTML = jsonObject.error;
                }
            }
        };
		// sends HTTP request to server
        xhr.send(jsonPayload);
    } 
	// handles exceptions during request execution (network errors)
	catch (err) 
	{
        document.getElementById("searchContactResult").innerHTML = err.message;
	}
}

function deleteContact() 
{
	// clear existing result message
	document.getElementById("deleteContactResult").innerHTML = "";

    let confirmation = confirm("Are you sure you want to delete " + selectedFirstName + " " + selectedLastName + "?");
    
    if (confirmation) 
	{
        // JSON formatting
        let tmp = 
		{
            ID: selectedId
        };

        let jsonPayload = JSON.stringify(tmp);

        // same steps as Postman
        let url = urlBase + '/Delete.' + extension;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        xhr.onreadystatechange = function() 
		{
            if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("deleteContactResult").innerHTML = "Contact successfully deleted";            
			}
            else
			{
				document.getElementById("deleteContactResult").innerHTML = "Contact failed to delete";            
			}

			searchContact();
        };
        // sends HTTP request to server
        xhr.send(jsonPayload);
    }
}

function editContact()
{

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
	document.getElementById("contactFirstName").value = "";
    document.getElementById("contactLastName").value = "";
    document.getElementById("contactYachtName").value = "";
    document.getElementById("contactYachtSize").value = "";
    document.getElementById("contactPhone").value = "";
    document.getElementById("contactEmail").value = "";

	document.getElementById("addContactResult").innerHTML = "";

    document.getElementById("addContactModal").style.display = "none";
}

function handleKeyPress(event) 
{
	if (event.keyCode === 13) 
	{
		searchContact();
	}
}

function selectContact(Id, first, last) 
{
	selectedId = Id;
	selectedFirstName = first;
	selectedLastName = last;

	document.getElementById("deleteContactResult").innerHTML = "";

	document.getElementById("deleteButton").style.display = "block";

	let selectButtons = document.querySelectorAll('.select-button');
	selectButtons.forEach(button => 
	{
        if (button.dataset.contactId !== Id) 
		{
            button.parentNode.parentNode.style.display = 'none';
        }
		else
		{
			if (button.textContent === 'Select') 
			{
                button.textContent = 'Deselect';
                button.onclick = function() 
				{
                    searchContact();
                };
            } 
			else 
			{
                button.textContent = 'Select';
                button.onclick = function() 
				{
                    selectContact(selectedId, selectedFirstName, selectedLastName);
                };
			}
		}
    });
}

function handleClick() 
{
    clickCount++;
    if (clickCount === 10) 
	{
        showCoinGif();
    }
}

function showCoinGif() 
{
    const gifContainers = document.querySelectorAll(".moving-gif-container");
    gifContainers.forEach((container, index) => 
	{
        setTimeout(() => 
		{
            container.style.display = "block";
            container.style.animationName = "moveDown";
        }, index * 1000); 
    });
}

function handleCoinClick(coin) 
{
    coin.parentElement.style.display = "none";
}

