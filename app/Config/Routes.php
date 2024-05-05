<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

$routes->get('test', 'Test::index');

//account
$routes->post('account/password-reset', 'Account::passwordResetProcess');
$routes->post('account/signin-process', 'Account::signInProcess');
$routes->post('account/signup-process', 'Account::signUpProcess');
$routes->get('account/logout', 'Account::signOutProcess');

//-----Page View Related Routes------//
$routes->get('user/(:any)', 'Page::view/$1');
$routes->get('account/(:any)', 'Page::view/$1');
$routes->get('gamemaster/(:any)', 'Page::view/$1');
$routes->get('admin/(:any)', 'Page::view/$1');
$routes->get('/', 'Page::view/login');
