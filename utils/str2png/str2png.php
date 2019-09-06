<?php 
//把json配置文本文件转化成png图片, 优点是数据非明文存储, 并且文件更小
//把字符转成ascii值, 每个真彩色像素可以存储3个字符(RGB)
function str2png($str, $imgPath)
{
	$charCodes = array();
	for ($i=0; $i<strlen($str); $i++)
	{
		$charCode = ord($str[$i]);
		if ($charCode > 255) throw new Exception("Unsupported charecter ".$str[$i]);
		$charCodes[] = $charCode;
	}
	
	$length = count($charCodes);
	$imgWidth = ceil($length/3); 
	$imgHeight = 1;
	
	$img = imagecreatetruecolor($imgWidth, $imgHeight);
	for ($i=0; $i<$imgWidth; $i++)
	{
		$r = $i*3;
		$g = $r+1;
		$b = $r+2;
		
		$red = $r < $length ? $charCodes[$r] : 0;
		$green = $g < $length ? $charCodes[$g] : 0;
		$blue = $b < $length ? $charCodes[$b] : 0;
		
		$color = imagecolorexact($img, $red, $green, $blue);
		if ($color == -1) $color = imagecolorallocate($img, $red, $green, $blue);
		
		imagesetpixel($img, $i, 0, $color);
	}
				
	imagepng($img, $imgPath);
	imagedestroy($img);
}

if (count($argv) != 2) 
{
	echo 'Usage: Convert .json to .png. Please input an folder to read';
	exit;
}
else
{
	$inputPath = $argv[1];
	$files = scandir($inputPath);	
	for ($i=0; $i<count($files); $i++)
	{	
		if (pathinfo($files[$i], PATHINFO_EXTENSION) == 'json')
		{
			$str = file_get_contents($inputPath.DIRECTORY_SEPARATOR.$files[$i]);
			str2png($str, $inputPath.DIRECTORY_SEPARATOR.pathinfo($files[$i], PATHINFO_FILENAME).'.png');
		}	
	}
}
 

?>