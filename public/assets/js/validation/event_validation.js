$("#event-create").validate({
    rules: {
        name: {
            required: true,
            minlength: 3,
            maxlength: 50,
        }
        ,story_date: {
            required: true,
        }
        ,oc_start_time: {
            required: true,
        }
        ,oc_end_time: {
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
