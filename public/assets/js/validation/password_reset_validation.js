$("#form-password_forget").validate({
    rules: {
        password: {
			minlength: 10,
			required: true,
		}
		,password_repeat: {
			required: true,
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
