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

$("#form-adventure").validate({
    ignore: [],
    rules: {
        event_id: {
            required: true,
        },
        question_1: {
            required: true,
        }
        ,question_2: {
            required: true,
        }
        ,question_3: {
            required: true,
        }
        ,question_4: {
            required: true,
        }
        ,question_5: {
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

