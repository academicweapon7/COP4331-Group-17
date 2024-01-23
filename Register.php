
<?php

	$inData = getRequestInfo();
	
	$ID = 0;
	$Login = $inData["Login"];
	$FirstName = "";
	$LastName = "";

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// Check if the login already exists
		$checkLogin = $conn->prepare("SELECT ID FROM Users WHERE Login = ?");
		$checkLogin->bind_param("s", $Login);
		$checkLogin->execute();
		$result = $checkLogin->get_result();
		
		// Login already exists, return an error
		if ( $row = $result->fetch_assoc())
		{
			returnWithError("Login is already in use.");
		}
		
		// Add new user
		else
		{
			$stmt = $conn->prepare("INSERT INTO Users (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");
			$stmt->bind_param("ssss", $inData["FirstName"], $inData["LastName"], $inData["Login"], $inData["Password"]);
			$stmt->execute();
			$stmt->close();
			$conn->close();
			returnWithError("");
		}
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithInfo( $FirstName, $LastName, $ID )
	{
		$retValue = '{"ID":' . $ID . ',"FirstName":"' . $FirstName . '","LastName":"' . $LastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"ID":0,"Login":"' . $Login . '","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
