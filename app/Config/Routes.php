<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

//-----Page View Related Routes------//
//--admin
$routes->get('admin/(:any)', 'Page::view/admin/$1');
$routes->get('admin/(:any)/(:any)', 'Page::view/admin/$1/$2');
$routes->get('admin/(:any)/(:any)/(:any)', 'Page::view/admin/$1/$2/$3');
//--gamemaster
$routes->get('gamemaster/(:any)', 'Page::view/gamemaster/$1');
$routes->get('gamemaster/(:any)/(:any)', 'Page::view/gamemaster/$1/$2');
$routes->get('gamemaster/(:any)/(:any)/(:any)', 'Page::view/gamemaster/$1/$2/$3');
//--user
$routes->get('user/(:any)', 'Page::view/user/$1');
$routes->get('user/(:any)/(:any)', 'Page::view/user/$1/$2');
$routes->get('user/(:any)/(:any)/(:any)', 'Page::view/user/$1/$2/$3');
//--account
$routes->get('account/activate/(:any)/(:any)', 'Account::activateUser/$1/$2');
$routes->get('account/password_reset/(:any)/(:any)', 'Account::passwordReset/$1/$2');
$routes->get('account/logout', 'Account::signOutProcess');
$routes->get('account/(:any)', 'Page::view/page/$1');

$routes->post('action/get-dropdown', 'Character::getDropdown');
$routes->post('action/get-details', 'Character::getDetails');
$routes->post('account/password-forgot', 'Account::passwordForgotProcess');
$routes->post('account/password-reset', 'Account::passwordResetProcess');
$routes->post('account/signin-process', 'Account::signInProcess');
$routes->post('account/signup-process', 'Account::signUpProcess');
$routes->post('account/update-profile', 'Account::updateProfile');
$routes->post('account/update-profile', 'Account::updateProfile');

//------
$routes->get('/', 'Page::view/page/$1');