$("#event-create").validate({
    rules: {
        title: {
            required: true,
            minlength: 10,
            maxlength: 50,
        }
        ,name: {
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
        ,description: {
            maxlength: 2000,
        }
    }
    ,errorClass: 'input-error'
    ,errorPlacement: function (error, element) {
        var container = element.closest('.input-wrapper');
        error.insertAfter(container);
    }
    ,invalidHandler: function() {
        $('button[type="submit"]').attr('disabled',false);
    }
    ,submitHandler: function(form) {
        $('button[type="submit"]').attr('disabled',true);
        form.submit();
    }
});
