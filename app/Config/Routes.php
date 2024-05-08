<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

//-----Page View Related Routes------//
$routes->get('user/activate/(:any)/(:any)', 'Account::activateUser/$1/$2');
$routes->get('user/password_reset/(:any)/(:any)', 'Account::passwordReset/$1/$2');
$routes->get('user/(:any)', 'Page::view/$1');
//------
$routes->get('manual/(:any)', 'Page::view/manual/$1');

//------
$routes->get('gamemaster/(:any)', 'Page::view/$1');
$routes->get('gamemaster/(:any)/(:any)', 'Page::view/$1/$2');
$routes->get('gamemaster/(:any)/(:any)/(:any)', 'Page::view/$1/$2/$3');
//------
$routes->get('admin/(:any)/(:any)', 'Page::view/$1/$2');
$routes->get('admin/(:any)/(:any)/(:any)', 'Page::view/$1/$2/$3');

//account
$routes->post('account/password-reset', 'Account::passwordResetProcess');
$routes->post('account/signin-process', 'Account::signInProcess');
$routes->post('account/signup-process', 'Account::signUpProcess');
$routes->post('account/update-profile', 'Account::updateProfile');
$routes->get('account/logout', 'Account::signOutProcess');
$routes->get('account/(:any)', 'Page::view/$1');
//------

$routes->get('/', 'Page::view/login');