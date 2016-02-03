/*
**	Recupere uid et pid en param GET afin de pré remplire les inputs	
**
**/

setTimeout(function(){
	var param = 'uid';
	
	var uid = decodeURIComponent((new RegExp('[?|&]' + param + '=' + 
                '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, 
                '%20'))||null;

	if(uid != null)
	{
	    var uid_elem = document.getElementsByName('/newplot/user/name');
		uid_elem[0].value=uid;
	}

	param = 'pid';
	var pid = decodeURIComponent((new RegExp('[?|&]' + param + '=' + 
                '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, 
                '%20'))||null;

	if(pid != null)
	{
	    var pid_elem = document.getElementsByName('/newplot/plot/pid');
		pid_elem[0].value=pid;
	}
		
}, 2000);