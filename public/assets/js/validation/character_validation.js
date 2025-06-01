$("#form-character").validate({
    ignore: [],
    rules: {
        char_name: {
            required: true,
        }
        ,char_type: {
            required: true,
        }
        ,char_status: {
            required: true,
        }
    }
    ,errorClass: 'input-error cell'
    ,errorPlacement: function (error, element) {
        error.insertAfter(element.parent());
    }
    ,submitHandler: function(form) {
        $('button[type="submit"]').attr('disabled',true);
        form.submit();
    }
});
