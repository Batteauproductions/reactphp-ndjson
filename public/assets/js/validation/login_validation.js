$("#form-login").validate({
    rules: {
        username: {
            required: true,
            minlength: 5,
            maxlength: 25,
        }
        ,password: {
            required: true,
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
