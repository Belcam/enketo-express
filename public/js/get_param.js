/*
**	Recupere tous les params GET afin de pré remplire les inputs	
**
**/

var ready = function ( fn ) {

    // Sanity check
    if ( typeof fn !== 'function' ) return;

    document.addEventListener( 'enketo_loaded_form', fn, false );

};

ready( function() {
//console.log = console.__proto__.log;

	var params = window.location.search.substring(1).split('&');
        if(params.length <= 0)
          return;
	for(var i = 0; i < params.length; ++i) {
		var param = params[i].split('=');
		var key = param[0];
		var val = decodeURIComponent(param[1]);
		var elems = document.getElementsByName('/'+key.replace(/_/g, '/'));
		if(elems && elems.length) {
                        var elem = elems[0];
			elem.value = val;
			//elem[0].setAttribute("disabled", "disabled");
			elem.setAttribute('readonly', 'readonly');
			elem.removeAttribute('data-required');
                        var evt = new Event('change', {'bubbles': true});
                        elem.dispatchEvent(evt);
		}
	}

	/* Forcer l'event changeDate de tous les inputs Date afin qu'il accepte la valeur par defaut */
	var inputs_date = document.getElementsByClassName("ignore input-small");

	for (var i = 0; i < inputs_date.length; i++) {
		var evt = new Event('changeDate', {'bubbles':true});
		inputs_date[i].dispatchEvent(evt);
	}

	var inputs = document.getElementsByTagName("input");

	for (var i = 0; i < inputs.length; i++) {
		if(inputs[i].getAttribute('data-preload')=="timestamp");
		{
			var evt = new Event('changeDate', {'bubbles':true});
			inputs[i].dispatchEvent(evt);
		}
	}
	
});

