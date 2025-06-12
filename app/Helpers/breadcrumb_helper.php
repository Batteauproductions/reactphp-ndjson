<?php

use CodeIgniter\HTTP\URI;

function generate_breadcrumbs()
{
    $segments = service('uri')->getSegments();
    $breadcrumbs = [];
    $base = base_url();

    $path = '';

    foreach ($segments as $index => $segment) {
        $path .= '/' . $segment;
        $label = ucwords(str_replace(['-', '_'], ' ', $segment));

        if ($index !== array_key_last($segments)) {
            $breadcrumbs[] = [
                'label' => $label,
                'url' => $base . $path
            ];
        } else {
            $breadcrumbs[] = [
                'label' => $label,
                'url' => '' // current page, no link
            ];
        }
    }

    return view('_templates/breadcrumbs', ['breadcrumbs' => $breadcrumbs]);
}
