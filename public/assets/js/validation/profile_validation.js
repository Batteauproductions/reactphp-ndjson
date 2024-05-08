// JavaScript Document
$("#form-signup").validate({
	rules: {
		email: {
			required: true,
			maxlength: 250,
			email: true,
		}
        ,firstname: {
			required: true,
			minlength: 2,
			maxlength: 50,
		}
		,lastname: {
			required: true,
			minlength: 2,
			maxlength: 50,
		}
		,birthday: {
			dateISO: true,
			required: true,
			minAge: 15,
		}
		,discord: {
			maxlength: 50,
		}		
		,password: {
			minlength: 10,
		}
		,password_repeat: {
			depends: "#password",
			equalTo: "#password"
		}
	}
	,errorClass: 'input-error'
	,errorPlacement: function (error, element) {
		error.insertAfter(element);
	}
	,submitHandler: function(form) {
		$('button[type="submit"]').attr('disabled',true);
		form.submit();
	}
});

$.validator.addMethod("lettersonly", function(value, element) {
  return this.optional(element) || /^[a-z]+$/i.test(value);
}, "Gelieve enkel letters in te vullen");

 $.validator.addMethod("minAge", function(value, element, min) {
    var today = new Date();
    var birthDate = new Date(value);
    var age = today.getFullYear() - birthDate.getFullYear();

    if (age > min + 1) {
      return true;
    }

    var m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= min;
  }, "Je moet ouder zijn dan 16 om deel te nemen aan onze evenementen");

  