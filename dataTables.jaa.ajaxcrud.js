(function($) {

  $.fn.AjaxCrudDataTables = function( args ) {
    // Establish our default settings
    var settings = $.extend({
        modal	: null,
        table	: null,
    }, args);

    var table = settings.table,
		    tableId = table.table().node().id,
    		modal = settings.modal,
		    modalId = modal.attr('id'),
    		form = modal.find('form'),
		    formAction = form.attr('action'),
		    formMethod = form.attr('method'),
		    formSelects = form.data('select'),
		    formData = form.get(0),
    		btn = form.find('[type="submit"]');

    return this.each( function() {
    	// autofocus first input element
			$(modal).on('shown.bs.modal', function () {
			  $(this).find('input:first').focus();
			});

			// reset input default state on keyup
			$('#'+modalId+' input, textarea, select').on('keyup change', function () {
			  $(this).parent().removeClass('has-error');
			  $(this).siblings('span').remove();
			});

			$(modal).on('submit', form, function (e) {
			  e.preventDefault();

			 	$(form).find('input, textarea, select').attr("readonly", true);
			  $(btn).attr("disabled", true);
			  $(btn).html("Saving <i class='fa fa-spinner fa-pulse'></i>");

			  $.ajax({
			    headers: {
			      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			    },
			    type: formMethod,
			    url: formAction,
			    // data: form.serialize(),
			    data: new FormData(formData),
			    dataType: 'json',
			    processData: false,
					contentType: false,
			    success: function (data) {
			      form.find('input, textarea').val(''); // reset form
			      $(modal).modal('hide'); // hide modal

			      var data = JSON.stringify(data);
			      var data = JSON.parse(data);
			      var data = data.response;

			      // append new item into the select tag
			      if (formSelects) { // check if existing
				      for (var key in data) {
						    if (data.hasOwnProperty(key)) {
					        for(var i = 0; i < formSelects.length; i++) {
						        var formSelect = formSelects[i];
						        if (key == formSelect) {
						        	var value = key+"_id";
						        	var value = data[value];
						        	var checkOption = " option[value="+value+"]";
						        	var select = $("."+formSelect+checkOption);
						        	var checkSelect = $(form).find(select).length > 0;
						        	if (!checkSelect) {
						        		$(form).find(document.getElementsByClassName(formSelect)).append(new Option(data[key], value));
						        	}
						        }
						      }
						    }
							}
						}

						// add row into table & initialize node for css
						var rowNode = table.row.add(data).order([0, 'desc']).draw(false).node();

						// add css when added
						$(rowNode).addClass('selected');
						setTimeout(function(){$(rowNode).removeClass('selected');}, 2000);
			    },
			    error: function (data) {
			      var data = JSON.stringify(data);
			      var data = JSON.parse(data);
			      var data = data.responseJSON;

			      if (data.validator) { // check if there's validation error
			        for (var key in data.validator) {
			          if (data.validator.hasOwnProperty(key)) {
			            $(document.getElementsByName(key)).parent().addClass('has-error');
			            var flash_err = '<span class="form-text text-danger">'+data.validator[key]+'</span>';
			            $(document.getElementsByName(key)).next().html(''); // reset to default
			            $(flash_err).insertAfter(document.getElementsByName(key));
			          }
			        }
			      }
			    },
			    complete: function () {
			    	// autofocus first input element
						$(form).find('input:first').focus();
			      $(form).find('input, textarea, select').attr("readonly", false);
			      $(btn).attr("disabled", false);
			      $(btn).html("Save");
			    }
			  });
			});
    });
  }

}(jQuery));