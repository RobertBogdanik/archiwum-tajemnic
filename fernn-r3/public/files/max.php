<?php
	require('tfpdf.php');

	class PDF extends TFPDF
	{
		function Header()
		{
			$this->Image($_SESSION['Logo'],10,6,30);

			$this->Cell(40);
			
			$this->AddFont('DejaVu','','/PottaOne-Regular.ttf',true);
			$this->SetFont('DejaVu','',20);
			$this->SetTextColor(22,78,135);
			
			$this->Cell(0,12,'Potwierdzenie przyjęcia reklamacji', 0,1,'C');
			$this->Cell(0,12,'nr. '.$_SESSION['Complaint_number'], 0,1,'C');
		}
	}

	$pdf = new PDF();
	$pdf->AliasNbPages();
	$pdf->AddPage();

	$pdf->AddFont('DejaVu','','DejaVuSansCondensed.ttf',true);
	$pdf->SetFont('DejaVu','',14);

	$pdf->AddFont('NotoSerif','','NotoSerif-Bold.ttf',true);

	$pdf->Cell(0,10,'',0,1,'c');
	$pdf->SetFont('DejaVu','',20);
	$pdf->SetTextColor(22,78,135);
	$pdf->Cell(0,8,'Twoja reklamacja została przyjęta',0,1,'C');
	$pdf->Cell(0,8,'w '.$_SESSION['Company'],0,1,'C');

	$pdf->Cell(0,10,'',0,1,'c');
	$pdf->Cell(0,8,'Oto najważniejsze informacje:',0,1,'C');

	$pdf->Cell(0,5,'',0,1,'c');
	$pdf->SetFont('DejaVu','',14);
	$pdf->SetTextColor(0,0,0);

	$pdf->SetFont('NotoSerif','',14);
	$pdf->Cell(0,9,'Data przyjęcia: '.$dan[4], 0,1,'C');
	$pdf->Cell(0,9,'Producent: '.$dan[6], 0,1,'C');
	$pdf->Cell(0,9,'Model: '.$dan[5], 0,1,'C');
	$pdf->Cell(0,9,'Opis usterki: '.$dan[11], 0,1,'C');
	$pdf->Cell(0,9,'Rodzaj reklamacji: '.$dan[7], 0,1,'C');
	$pdf->Cell(0,9,'Uwagi: '.$dan[8], 0,1,'C');

	$pdf->Cell(0,10,'',0,1,'c');
	$pdf->SetTextColor(22,78,135);
	$pdf->SetFont('DejaVu','',20);
	$pdf->Cell(0,8,'Możesz śledzić status reklamacji wchodząc',0,1,'C');
	$pdf->Cell(0,8,' na stronę www.fernn.pl',0,1,'C');

	$pdf->Cell(0,10,'',0,1,'c');
	$pdf->SetFont('NotoSerif','',14);
	$pdf->SetTextColor(0,0,0);
	$pdf->Cell(0,9,'Kod: '.$dan[9], 0,1,'C');
	$pdf->Cell(0,9,'Pin: '.$dan[10], 0,1,'C');

	$pdf->SetFont('DejaVu','',20);
	$pdf->SetTextColor(22,78,135);
	$pdf->Cell(0,10,'',0,1,'c');

	$pdf->Cell(0,8,'lub skanując poniższy kod',0,1,'C');

	$pdf->Cell(0,40,'',0,1,'c');
	$link='https://chart.googleapis.com/chart?cht=qr&chs=40x40&chl=http://fernn.pl/status?fnr='.$dan[9].$dan[10].'&chld=L|1';
	$pdf->Image($link,70,210,70,70,'PNG');

	$pdf->AddPage();
	$pdf->SetFont('NotoSerif','',14);
	$pdf->SetTextColor(0,0,0);
	$pdf->Cell(0,9,'Reklamujący: '.$dan[1]." ".$dan[2], 0,1,'C');
	$pdf->Cell(0,9,'Telefon kontaktowy: '.$dan[3], 0,1,'C');
	$pdf->Cell(0,9,'Data przyjęcia: '.$dan[4], 0,1,'C');
	$pdf->Cell(0,9,'Producent: '.$dan[6], 0,1,'C');
	$pdf->Cell(0,9,'Model: '.$dan[5], 0,1,'C');
	$pdf->Cell(0,9,'Rodzaj reklamacji: '.$dan[7], 0,1,'C');
	$pdf->Cell(0,9,'Opis usterki: '.$dan[11], 0,1,'C');
	$pdf->Cell(0,9,'Uwagi: '.$dan[8], 0,1,'C');
	$pdf->Cell(0,9,'Kod: '.$dan[9] , 0,1,'C');
	$pdf->Cell(0,9,'Pin: '.$dan[10], 0,2,'C');

	if($pola==true)
	{
		$pdf->Cell(0,20,'',0,1,'c');
		$pdf->Cell(8);
		$pdf->Cell(0,10,'Potwierdzam powyższe dane',0,1,'C');
		$pdf->Cell(45);
		$pdf->Cell(100,25,'',1,1,'C');

		$pdf->Cell(0,20,'',0,1,'c');
		$pdf->Cell(9);
		$pdf->Cell(0,10,'Podpis odbierającego',0,1,'C');
		$pdf->Cell(45);
		$pdf->Cell(100,30,'',1,1,'R');
	}
	$pdf->Output();
?>