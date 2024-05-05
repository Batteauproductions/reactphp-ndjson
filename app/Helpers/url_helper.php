<?php


if (!function_exists('image_path')) {
    function image_path($path) {
        return base_url().'assets/images/'.$path;
    }
}

if (!function_exists('js_path')) {
    function js_path($path) {
        return base_url().'assets/js/'.$path;
    }
}

if (!function_exists('vendor_path')) {
    function vendor_path($path) {
        return base_url().'assets/vendor/'.$path;
    }
}
