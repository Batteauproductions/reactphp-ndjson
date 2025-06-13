<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

//-----Page View Related Routes------//
//--character
$routes->get('user/character/(:any)', 'Page::viewCharacters/$1');
//--gamemaster
$routes->get('gamemaster/(:any)', 'Page::viewGameMaster/$1');
$routes->get('gamemaster/(:any)/(:any)', 'Page::viewGameMaster/$1/$2');
$routes->get('gamemaster/(:any)/(:any)/(:any)', 'Page::viewGameMaster/$1/$2/$3');
//--admin
$routes->get('admin/(:any)', 'Page::viewAdmin/$1');
$routes->get('admin/(:any)/(:any)', 'Page::viewAdmin/$1/$2');
$routes->get('admin/(:any)/(:any)/(:any)', 'Page::viewAdmin/$1/$2/$3');
//--manual
$routes->get('manual/(:any)', 'Page::viewManual/$1');
//--user
$routes->get('user/profile', 'Page::viewProfile');
$routes->get('user/(:any)', 'Page::viewGeneric/$1');
$routes->get('user/(:any)/(:any)', 'Page::viewGameMaster/$1/$2');
$routes->get('user/(:any)/(:any)/(:any)', 'Page::viewGameMaster/$1/$2/$3');
//--account
$routes->get('account/activate/(:any)/(:any)', 'Account::activateUser/$1/$2');
$routes->get('account/password_reset/(:any)/(:any)', 'Account::passwordReset/$1/$2');
$routes->get('account/logout', 'Account::signOutProcess');
$routes->get('account/(:any)', 'Page::viewGeneric/$1');

//----
$routes->post('action/character-transfer', 'Character::Process');
$routes->post('action/get-adventure', 'Character::getAdventure');
$routes->post('action/get-background', 'Character::getBackground');
$routes->post('action/get-dropdown', 'Character::getDropdown');
$routes->post('action/get-details', 'Character::getDetails');
//----
$routes->post('account/password-forgot', 'Account::passwordForgotProcess');
$routes->post('account/password-reset', 'Account::passwordResetProcess');
$routes->post('account/signin-process', 'Account::signInProcess');
$routes->post('account/signup-process', 'Account::signUpProcess');
$routes->post('account/update-profile', 'Account::updateProfile');
//----
$routes->post('admin/user-delete', 'Account::accountDelete');
//----
$routes->post('event/submit-form', 'Event::submitForm');
$routes->post('event/update-form', 'Event::updateForm');

//------
$routes->get('/home', 'Page::viewGeneric');
$routes->get('/', 'Page::viewGeneric/login');