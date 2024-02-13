<?php

$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;

// Pagination parameters
$page = isset($inData['page']) ? intval($inData['page']) : 1;
$perPage = isset($inData['perPage']) ? intval($inData['perPage']) : 10; // Default to 10 items per page

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Calculate the offset based on the current page and items per page
    $offset = ($page - 1) * $perPage;

    $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email, YachtName, YachtSize FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ? OR YachtName LIKE ? OR YachtSize LIKE ?) AND UserID=? LIMIT ?, ?");
    $search = "%" . $inData["Search"] . "%";

    $stmt->bind_param("ssssssiii", $search, $search, $search, $search, $search, $search, $inData["UserID"], $offset, $perPage);

    $stmt->execute();

    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        if ($searchCount > 0) {
            $searchResults .= ",";
        }
        $searchCount++;
        $searchResults .= '{"ID": "' . $row["ID"] . '", "FirstName" : "' . $row["FirstName"] . '", "LastName" : "' . $row["LastName"] . '", "Phone" : "' . $row["Phone"] . '", "Email" : "' . $row["Email"] . '", "YachtName" : "' . $row["YachtName"] . '", "YachtSize" : "' . $row["YachtSize"] . '"}';
    }

    if ($searchCount == 0) {
        returnWithError("No Records Found");
    } else {
        returnWithInfo($searchResults);
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"results":[],"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults)
{
    $retValue = '{"results":[' . $searchResults . '],"error":""}';
    sendResultInfoAsJson($retValue);
}

?>
