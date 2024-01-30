
<?php

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, YachtName=?, YachtSize=?, Phone=?, Email=? WHERE ID=?");
		$stmt->bind_param("sssissi", $inData["FirstName"], $inData["LastName"], $inData["YachtName"], $inData["YachtSize"], $inData["Phone"], $inData["Email"], $inData["ID"]);
		$stmt->execute();

		if($stmt->affected_rows > 0)
		{
			returnWithInfo( $inData["ID"], $inData["FirstName"], $inData["LastName"], $inData["YachtName"], $inData["YachtSize"], $inData["Phone"], $inData["Email"]);
		}
		else
		{
			returnWithError( "Contact Failed To Update" );
		}

		$stmt->close();
		$conn->close();
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
	
	function returnWithError($err)
	{
		$response = array("error" => $err);
		sendResultInfoAsJson(json_encode($response));
	}
	
	function returnWithInfo($ID, $FirstName, $LastName, $YachtName, $YachtSize, $Phone, $Email)
	{
		$response = array(
			"ID" => $ID,
			"FirstName" => $FirstName,
			"LastName" => $LastName,
			"YachtName" => $YachtName,
			"YachtSize" => $YachtSize,
			"Phone" => $Phone,
			"Email" => $Email,
			"error" => ""
			);
		
		sendResultInfoAsJson(json_encode($response));
	}
	
?>
