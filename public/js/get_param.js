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
	var inputs_date = document.getElementsByClassName('widget date');
	for (var i = 0; i < inputs_date.length; i++) {
		var input = inputs_date[i].getElementsByTagName('input')[0];
		var evt = new Event('changeDate', {'bubbles':true});
                var old_dis = input.disabled;
                var old_ro  = input.readonly;
                input.disabled=false;
                input.readonly=false;
		input.dispatchEvent(evt);
                input.disabled=old_dis;
                input.readonly=old_ro;
	}

});



