<?php
	require('tfpdf.php');

	class PDF extends TFPDF
	{
		function Header()
		{
			$this->Image("../public/files/attachment-1618418577713.png",10,6,30);

			$this->Cell(40);
			
			$this->AddFont('DejaVu','','/PottaOne-Regular.ttf',true);
			$this->SetFont('DejaVu','',20);
			$this->SetTextColor(22,78,135);
			
			$this->Cell(0,12,'Potwierdzenie przyjęcia reklamacji', 0,1,'C');
			$this->Cell(0,12,'nr. '.'123/21', 0,1,'C');
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
	$pdf->Cell(0,8,'w '.$firma,0,1,'C');

	$pdf->Cell(0,10,'',0,1,'c');
	$pdf->Cell(0,8,'Oto najważniejsze informacje:',0,1,'C');

	$pdf->Cell(0,5,'',0,1,'c');
	$pdf->SetFont('DejaVu','',14);
	$pdf->SetTextColor(0,0,0);

	$pdf->SetFont('NotoSerif','',14);
	$pdf->Cell(0,9,'Data przyjęcia: '.$dodano, 0,1,'C');
	$pdf->Cell(0,9,'Producent: '.$nazwa, 0,1,'C');
	$pdf->Cell(0,9,'Model: '.$model, 0,1,'C');
	$pdf->Cell(0,9,'Opis usterki: '.$opis, 0,1,'C');
	$pdf->Cell(0,9,'Rodzaj reklamacji: '.$rodzaj, 0,1,'C');
	$pdf->Cell(0,9,'Uwagi: '.$uwagi, 0,1,'C');

	$pdf->Cell(0,10,'',0,1,'c');
	$pdf->SetTextColor(22,78,135);
	$pdf->SetFont('DejaVu','',20);
	$pdf->Cell(0,8,'Możesz śledzić status reklamacji wchodząc',0,1,'C');
	$pdf->Cell(0,8,' na stronę www.fernn.cc',0,1,'C');

	$pdf->Cell(0,10,'',0,1,'c');
	$pdf->SetFont('NotoSerif','',14);
	$pdf->SetTextColor(0,0,0);
	$pdf->Cell(0,9,'Kod: '.$kod, 0,1,'C');
	$pdf->Cell(0,9,'Pin: '.$pin, 0,1,'C');

	$pdf->SetFont('DejaVu','',20);
	$pdf->SetTextColor(22,78,135);
	$pdf->Cell(0,10,'',0,1,'c');

	$pdf->Cell(0,8,'lub skanując poniższy kod',0,1,'C');

	$pdf->Cell(0,40,'',0,1,'c');
	$link='https://chart.googleapis.com/chart?cht=qr&chs=40x40&chl=http://fernn.cc/status?fnr=fdsffsdFgts435dfg&chld=L|1';
	$pdf->Image($link,70,210,70,70,'PNG');

	$pdf->AddPage();
	$pdf->SetFont('NotoSerif','',14);
	$pdf->SetTextColor(0,0,0);
	$pdf->Cell(0,9,'Reklamujący: '.$imie." ".$nazwisko, 0,1,'C');
	$pdf->Cell(0,9,'Telefon kontaktowy: '.$telefon, 0,1,'C');
	$pdf->Cell(0,9,'Data przyjęcia: '.$dodano, 0,1,'C');
	$pdf->Cell(0,9,'Producent: '.$nazwa, 0,1,'C');
	$pdf->Cell(0,9,'Model: '.$model, 0,1,'C');
	$pdf->Cell(0,9,'Rodzaj reklamacji: '.$rodzaj, 0,1,'C');
	$pdf->Cell(0,9,'Uwagi: '.$uwagi, 0,1,'C');
	$pdf->Cell(0,9,'Kod: '.$kod , 0,1,'C');
	$pdf->Cell(0,9,'Pin: '.$pin, 0,2,'C');

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
	$pdf->Output();
?>