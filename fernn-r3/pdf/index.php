<?php
	$db_host = "localhost";
	$db_user = "master";
	$db_password = "Brtk123.";
	$db_name = "fernn";
	$polaczenie = @new mysqli($db_host, $db_user, $db_password, $db_name);
	session_start();

	if(isset($_GET['CID']) && isset($_GET['RID']) && isset($_GET['code'])){
		$sql='SELECT co.Name, `Company`, `Added_date`, `Firstname`, `Lastname`, c.`Phone`, `Description`, `Type`, `Expectations`, `Comments`, `Code`, `Pin`, `Complaint_number`, m.Model, ma.Manufacturer FROM `complaints` AS c JOIN `models` AS m ON c.Model=m._ID JOIN `manufacturers` AS ma ON m.Manufacturer = ma._ID JOIN `company` AS co ON c.Company=co._ID WHERE `Company`="'.$_GET['CID'].'" AND c.`_ID`="'.$_GET['RID'].'" AND `Code`="'.$_GET['code'].'"';

		$rezultat = @$polaczenie->query($sql);

		$wiersz = $rezultat->fetch_assoc();
		$dan = [];

/* 0 */		$dan[] = $wiersz['Complaint_number'];   
/* 1 */		$dan[] = base64_decode ($wiersz['Firstname']);
/* 2 */		$dan[] = base64_decode ($wiersz['Lastname']);
/* 3 */		$dan[] = base64_decode ($wiersz['Phone']);
/* 4 */		$dan[] = $wiersz['Added_date'];
/* 5 */		$dan[] = $wiersz['Model'];
/* 6 */		$dan[] = $wiersz['Manufacturer'];
/* 7 */		$dan[] = $wiersz['Type'];
/* 8 */		$dan[] = $wiersz['Comments'];
/* 9 */		$dan[] = $wiersz['Code'];
/* 10 */	$dan[] = $wiersz['Pin'];
/* 11 */	$dan[] = $wiersz['Description'];
/* 12 */	$dan[] = $wiersz['Company'];
/* 13 */	$dan[] = $wiersz['Name'];
/* 14 */	$dan[] = $wiersz['Expectations'];

		$pola = true;
		if($wiersz['Type']=="Wewnętrzna"){ $pola = false; }
		if($dan[14] != null){ $dan[7]=$dan[7]." => ".$dan[14]; }
		if($dan[8] == null){ $dan[8]="brak"; }

		$_SESSION['Complaint_number'] = $dan[0];
		$_SESSION['Company'] = $dan[13];
		require "min.php";
	}
?>