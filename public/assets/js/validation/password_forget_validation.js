$("#form-password_forget").validate({
    rules: {
        email: {
			required: true,
			maxlength: 250,
			email: true,
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
