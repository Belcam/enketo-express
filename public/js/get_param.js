/*
**	Recupere tous les params GET afin de pré remplire les inputs	
**
**/

// from http://gomakethings.com/a-native-javascript-equivalent-of-jquerys-ready-method/
var ready = function ( fn ) {

    // Sanity check
    if ( typeof fn !== 'function' ) return;

    // If document is already loaded, run method
    if ( document.readyState === 'complete'  ) {
        return fn();
    }

    // Otherwise, wait until document is loaded
    // The document has finished loading and the document has been parsed but sub-resources such as images, stylesheets and frames are still loading. The state indicates that the DOMContentLoaded event has been fired.
    //document.addEventListener( 'interactive', fn, false );

    // Alternative: The document and all sub-resources have finished loading. The state indicates that the load event has been fired.
    //document.addEventListener( 'complete', fn, false );
    //document.addEventListener( 'DOMContentLoaded', fn, false );
    document.addEventListener( 'enketo_loaded_form', fn, false );

};

ready( function() {
//console.log = console.__proto__.log;

	var params = window.location.search.substring(1).split('&');
//console.log(params);
        if(params.length <= 0)
          return;
	for(var i = 0; i < params.length; ++i) {
		var param = params[i].split('=');
		var key = param[0];
		var val = decodeURIComponent(param[1]);
		var elem = document.getElementsByName('/'+key.replace(/_/g, '/'));
		if(elem && elem.length) {
			elem[0].value = val;
			elem[0].setAttribute("disabled", "disabled");
		}
	}
});
//}, 500);
	/*var param = 'uid';
	
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
	}*/
//}, 500);
