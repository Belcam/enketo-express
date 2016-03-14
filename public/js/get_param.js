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

	var inputs = document.getElementsByTagName('input');

	for (var i = 0; i < inputs.length; i++)
	{
		if(inputs[i].getAttribute('class')=="ignore input-small")
		{
			var evt = new Event('changeDate', {'bubbles':true});
			inputs[i].disabled=false;
			inputs[i].readOnly=false;

			inputs[i].dispatchEvent(evt);

			inputs[i].changeDate= function(){
				var input_2 = document.getElementsByTagName('input');
				var evt = new Event('changeDate', {'bubbles':true});
				var val = this.value;
				this.setAttribute('value',val);

				for (var j = 0; j < input_2.length; j++)
				{
					if(input_2[j].getAttribute('class')=="ignore input-small")
					{
						input_2[j].disabled=false;
						input_2[j].readOnly=false;
						input_2[j].setAttribute('value', val);
						input_2[j].dispatchEvent(evt);
					}

					// if(input_2[j].getAttribute('data-preload')=="timestamp")
					// {
					// 	var evt = new Event('changeDate', {'bubbles':true});
					// 	input_2[j].disabled=false;
					// 	input_2[j].readOnly=false;
					// 	input_2[j].dispatchEvent(evt);
					// }

					if(input_2[j].getAttribute('type')=="date")
					{
						input_2[j].disabled=false;
						input_2[j].readOnly=false;
						input_2[j].setAttribute('value', val);
						input_2[j].dispatchEvent(evt);
					}
				}
			};

		}

		if(inputs[i].getAttribute('data-preload')=="timestamp")
		{
			var evt = new Event('changeDate', {'bubbles':true});
			inputs[i].disabled=false;
			inputs[i].readOnly=false;
			inputs[i].dispatchEvent(evt);
		}

		if(inputs[i].getAttribute('type')=="date")
		{
			var evt = new Event('changeDate', {'bubbles':true});
			inputs[i].disabled=false;
			inputs[i].readOnly=false;
			inputs[i].dispatchEvent(evt);
		}
	}	
});



