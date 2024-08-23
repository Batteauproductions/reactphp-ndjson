$("#form-character").validate({
    ignore: [],
    rules: {
        character: {
            required: true,
        }
        ,char_name: {
            required: true,
        }
        ,char_race: {
            required: true,
        }
        ,char_type: {
            required: true,
        }
    }
    ,errorClass: 'input-error'
    ,errorPlacement: function (error, element) {
        if (element.attr("name") == "character") {
            error.appendTo(".profile-avatar");
        } else {
            error.insertAfter(element);
        }
    }
    ,submitHandler: function(form) {
        $('button[type="submit"]').attr('disabled',true);
        form.submit();
    }
});
