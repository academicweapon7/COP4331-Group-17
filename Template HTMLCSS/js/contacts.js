// Function to display the modal
function showAddContactForm() 
{
   var modal = document.getElementById("addContactModal");
   modal.style.display = "block";
}

function closeAddContactForm() 
{
    document.getElementById("addContactModal").style.display = "none";
    // Reset input values
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("yachtName").value = "";
    document.getElementById("yachtSize").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";
}

function addContact() 
{
    // AJAX request to add contact
}

function deleteContact()
{

}
