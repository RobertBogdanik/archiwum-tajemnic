<?php
	require('tfpdf.php');

	class PDF extends TFPDF
	{
		function Header()
		{
			$this->Image($_SESSION['Logo'],10,6,30);

			$this->Cell(40);
			$this->AddFont('DejaVu','','PottaOne-Regular.ttf',true);
			$this->SetFont('DejaVu','',18);
			$this->SetTextColor(22,78,135);
			
			$this->Cell(0,12,'Potwierdzenie przyjęcia reklamacji nr. '.$_SESSION['Complaint_number'].'', 0,1,'C');
			$this->SetFont('DejaVu','',16);
			$this->Cell(0,12,'w '.$_SESSION['Company'], 0,1,'R');
			
			$this->Ln(10);
		}
	}

	$pdf = new PDF();
	$pdf->AliasNbPages();
	$pdf->AddPage();

	$pdf->AddFont('NotoSerif','','NotoSerif-Bold.ttf',true);
	$pdf->AddFont('DejaVu','','DejaVuSansCondensed.ttf',true);

	$pdf->Cell(0,5,'',0,1,'c');
	$pdf->SetFont('DejaVu','',12);
	$pdf->SetTextColor(0,0,0);

	$pdf->SetFont('NotoSerif','',10);
	$pdf->Cell(80);
	$pdf->Cell(0,4,'Data przyjęcia: '.$dan[4], 0,1,'C');
	$pdf->Cell(80);
	$pdf->Cell(0,4,'Producent: '.$dan[6], 0,1,'C');
	$pdf->Cell(80);
	$pdf->Cell(0,4,'Model: '.$dan[5], 0,1,'C');
	$pdf->Cell(80);
	$pdf->Cell(0,4,'Rodzaj reklamacji: '.$dan[7], 0,1,'C');
	$pdf->Cell(80);
	$pdf->Cell(0,4,'Uwagi: '.$dan[8], 0,1,'C');
	$pdf->Cell(80);
	$pdf->Cell(0,4,'Kod: '.$dan[9], 0,1,'C');
	$pdf->Cell(80);
	$pdf->Cell(0,4,'Pin: '.$dan[10], 0,2,'C');

	$link='https://chart.googleapis.com/chart?cht=qr&chs=40x40&chl=http://fernn.pl/status?fnr='.$dan[9].$dan[10].'&chld=L|1';
	$pdf->Image($link,25,40,40,40,'PNG');

	$pdf->Cell(0,5,'',0,1,'c');
	$pdf->SetTextColor(22,78,135);
	$pdf->SetFont('DejaVu','',12);
	$pdf->Cell(0,5,'Możesz śledzić status reklamacji wchodząc na',0,2,'L');

	$pdf->Cell(135);
	$pdf->Cell(150,30,'',1,1,'L');

	$pdf->Cell(0,-30,'',0,1,'c');
	$pdf->Cell(0,5,'stronę www.fernn.pl lub skanując powyższy kod',0,1,'L');

	$pdf->Cell(0,3,'',0,1,'c');
	$pdf->SetTextColor(0,0,0);
	$pdf->SetFont('NotoSerif','',10);
	$pdf->Cell(0,8,'Dokument stanowi podstawę do odbioru reklamacji. Zadbaj o niego.',0,1,'L');

	$pdf->SetFont('NotoSerif','',12);
	$pdf->Cell(50,-10,'',0,1,'c');
	$pdf->Cell(0,5,'Nr. reklamacji: '.$dan[0],0,1,'R');
	$pdf->Cell(0,5,'Kod: '.$dan[9],0,1,'R');
	$pdf->Cell(0,5,'Pin: '.$dan[10].'   ',0,1,'R');

	$pdf->Cell(200,10,'',0,1,'c');

	$pdf->Line(0,117,250,117);

	$pdf->SetFont('NotoSerif','',10);
	$pdf->SetTextColor(0,0,0);
	$pdf->Cell(0,25,'',0,1,'c');
	$pdf->Cell(0,5,'Nr. reklamacji: '.$dan[0].'                  ', 0,1,'R');
	$pdf->Cell(0,5,'Reklamujący: '.$dan[1]." ".$dan[2].'                  ', 0,1,'R');
	$pdf->Cell(0,5,'Telefon kontaktowy: '.$dan[3].'                  ', 0,1,'R');
	$pdf->Cell(0,5,'Data przyjęcia: '.$dan[4].'                  ', 0,1,'R');
	$pdf->Cell(0,5,'Producent: '.$dan[6].'                  ', 0,1,'R');
	$pdf->Cell(0,5,'Model: '.$dan[5].'                  ', 0,1,'R');
	$pdf->Cell(0,5,'Rodzaj reklamacji: '.$dan[7].'                  ', 0,1,'R');
	$pdf->Cell(0,5,'Uwagi: '.$dan[8].'                  ', 0,1,'R');
	$pdf->Cell(0,5,'Kod: '.$dan[9].'                  ', 0,1,'R');
	$pdf->Cell(0,5,'Pin: '.$dan[10].'                  ', 0,2,'R');
	// $pdf->Cell(0,5,'Nr. reklamacji: '.$dan[0].'                  ', 0,1,'R');
	// $pdf->Cell(0,5,'Reklamujący: '.$dan[1]." ".$dan[2].'                  ', 0,1,'R');
	// $pdf->Cell(0,5,'Telefon kontaktowy: '.$dan[3].'                  ', 0,1,'R');
	// $pdf->Cell(0,5,'Data przyjęcia: '.$dan[4].'                  ', 0,1,'R');
	// $pdf->Cell(0,5,'Producent: '.$dan[6].'                  ', 0,1,'R');
	// $pdf->Cell(0,5,'Model: '.$dan[5].'                  ', 0,1,'R');
	// $pdf->Cell(0,5,'Rodzaj reklamacji: '.$dan[7].'                  ', 0,1,'R');
	// $pdf->Cell(0,5,'Uwagi: '.$dan[8].'                  ', 0,1,'R');
	// $pdf->Cell(0,5,'Kod: '.$dan[9].'                  ', 0,1,'R');
	// $pdf->Cell(0,5,'Pin: '.$dan[10].'                  ', 0,2,'R');

	if($pola==true)
	{
		$pdf->Cell(0,5,'',0,1,'c');
		$pdf->Cell(80);
		$pdf->Cell(0,10,'Potwierdzam powyższe dane',0,1,'C');
		$pdf->Cell(80);
		$pdf->Cell(100,25,'',1,1,'R');

		$pdf->Cell(0,5,'',0,1,'c');
		$pdf->Cell(80);
		$pdf->Cell(0,10,'Potwierdzam odebranie reklamacji',0,1,'C');
		$pdf->Cell(80);
		$pdf->Cell(100,25,'',1,1,'R');
	}
	$pdf->Output();
?>
