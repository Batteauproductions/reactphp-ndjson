<?php

/*
 | --------------------------------------------------------------------
 | App Namespace
 | --------------------------------------------------------------------
 |
 | This defines the default Namespace that is used throughout
 | CodeIgniter to refer to the Application directory. Change
 | this constant to change the namespace that all application
 | classes should use.
 |
 | NOTE: changing this will require manually modifying the
 | existing namespaces of App\* namespaced-classes.
 */
defined('APP_NAMESPACE') || define('APP_NAMESPACE', 'App');

/*
 | --------------------------------------------------------------------------
 | Composer Path
 | --------------------------------------------------------------------------
 |
 | The path that Composer's autoload file is expected to live. By default,
 | the vendor folder is in the Root directory, but you can customize that here.
 */
defined('COMPOSER_PATH') || define('COMPOSER_PATH', ROOTPATH . 'vendor/autoload.php');

/*
 |--------------------------------------------------------------------------
 | Timing Constants
 |--------------------------------------------------------------------------
 |
 | Provide simple ways to work with the myriad of PHP functions that
 | require information to be in seconds.
 */
defined('SECOND') || define('SECOND', 1);
defined('MINUTE') || define('MINUTE', 60);
defined('HOUR')   || define('HOUR', 3600);
defined('DAY')    || define('DAY', 86400);
defined('WEEK')   || define('WEEK', 604800);
defined('MONTH')  || define('MONTH', 2_592_000);
defined('YEAR')   || define('YEAR', 31_536_000);
defined('DECADE') || define('DECADE', 315_360_000);

/*
 | --------------------------------------------------------------------------
 | Exit Status Codes
 | --------------------------------------------------------------------------
 |
 | Used to indicate the conditions under which the script is exit()ing.
 | While there is no universal standard for error codes, there are some
 | broad conventions.  Three such conventions are mentioned below, for
 | those who wish to make use of them.  The CodeIgniter defaults were
 | chosen for the least overlap with these conventions, while still
 | leaving room for others to be defined in future versions and user
 | applications.
 |
 | The three main conventions used for determining exit status codes
 | are as follows:
 |
 |    Standard C/C++ Library (stdlibc):
 |       http://www.gnu.org/software/libc/manual/html_node/Exit-Status.html
 |       (This link also contains other GNU-specific conventions)
 |    BSD sysexits.h:
 |       http://www.gsp.com/cgi-bin/man.cgi?section=3&topic=sysexits
 |    Bash scripting:
 |       http://tldp.org/LDP/abs/html/exitcodes.html
 |
 */
defined('EXIT_SUCCESS')        || define('EXIT_SUCCESS', 0);        // no errors
defined('EXIT_ERROR')          || define('EXIT_ERROR', 1);          // generic error
defined('EXIT_CONFIG')         || define('EXIT_CONFIG', 3);         // configuration error
defined('EXIT_UNKNOWN_FILE')   || define('EXIT_UNKNOWN_FILE', 4);   // file not found
defined('EXIT_UNKNOWN_CLASS')  || define('EXIT_UNKNOWN_CLASS', 5);  // unknown class
defined('EXIT_UNKNOWN_METHOD') || define('EXIT_UNKNOWN_METHOD', 6); // unknown class member
defined('EXIT_USER_INPUT')     || define('EXIT_USER_INPUT', 7);     // invalid user input
defined('EXIT_DATABASE')       || define('EXIT_DATABASE', 8);       // database error
defined('EXIT__AUTO_MIN')      || define('EXIT__AUTO_MIN', 9);      // lowest automatically-assigned error code
defined('EXIT__AUTO_MAX')      || define('EXIT__AUTO_MAX', 125);    // highest automatically-assigned error code

/**
 * @deprecated Use \CodeIgniter\Events\Events::PRIORITY_LOW instead.
 */
define('EVENT_PRIORITY_LOW', 200);

/**
 * @deprecated Use \CodeIgniter\Events\Events::PRIORITY_NORMAL instead.
 */
define('EVENT_PRIORITY_NORMAL', 100);

/**
 * @deprecated Use \CodeIgniter\Events\Events::PRIORITY_HIGH instead.
 */
define('EVENT_PRIORITY_HIGH', 10);

/*SYSTEM*/
define('URL_DISCORD','https://discord.gg/5jpQ45DqB5');
define('URL_WORLD','https://larp.dalaria.nl');
define('URL_FACEBOOK','https://www.facebook.com/groups/2139624289625303');
define('URL_RULES', 'https://larp.dalaria.nl/regelsysteem/');
define('URL_RULES_BASE', 'https://larp.dalaria.nl/wp-content/uploads/documents/KvD-Basisregels.pdf');
define('URL_RULES_SPELLS', 'https://larp.dalaria.nl/wp-content/uploads/documents/KvD-Rituelen-Spreukenboek.pdf');
define('URL_RULES_GOODS', 'https://larp.dalaria.nl/wp-content/uploads/documents/KvD-Goederen-en-Ambachten.pdf');

define('EMAIL_WEBMASTER','stichting@dalaria.nl');
define('EMAIL_NAME', 'Stichting Dalaria');
define('EMAIL_REPLY', 'stichting@dalaria.nl');
define('EMAIL_BUG', 'spelleiding@dalaria.nl');
define('EMAIL_GENERIC', 'spelleiding@dalaria.nl');
define('EMAIL_FROM', 'spelleiding@dalaria.nl');

define('TITLE', 'Kronieken van Dalaria');
define('RIGHTS_ADMIN', array(1));
define('RIGHTS_GAMEMASTER', array(1,2));
define('RIGHTS_EDITOR', array(1,2,3));
define('RIGHTS_ALL', array(1,2,3,4));

//
define('CHARACTER_EDITABLE', array(1,7));
define('CHARACTER_WRITABLE', array(3,7));
define('CHARACTER_VIEWABLE', array(2,4,5));
define('CHRONICLE_ID', 2); // this is only changed once every few years

/*TABLES*/
define('TBL_EQUIPMENT','equipment');
define('TBL_SETTINGS','tool_settings');
define('TBL_CHAR','hero');
define('TBL_CHAR_COMMENTS','hero_comments');
define('TBL_CHAR_BUILD','hero_build');
define('TBL_CHAR_PROF','hero_professions');
define('TBL_CHAR_SKILL','hero_skills');
define('TBL_CHAR_STATUS','hero_status');
define('TBL_CHAR_STORIES','hero_stories');
define('TBL_CHAR_TYPES','hero_type');
define('TBL_CHAR_RACE','hero_race');
define('TBL_CHAR_ITEMS','hero_items');
define('TBL_RACE','race');
define('TBL_PROF','profession');
define('TBL_PROF_SUB','profession_subtype');
define('TBL_PROF_RANK','profession_ranks');
define('TBL_SKILL','skill');
define('TBL_SKILL_LINK','skill_links');
define('TBL_SKILL_TYPE','skill_types');
define('TBL_SKILL_SUB','skill_subtype');
define('TBL_ITEM','item');
define('TBL_ITEM_TYPE','item_type');
define('TBL_STATMOD','stat_modifier');
define('TBL_USER', 'user');
define('TBL_USER_DETAILS', 'user_details');
define('TBL_USER_ROLES', 'user_roles');
define('TBL_USER_STATUS', 'user_status');
define('TBL_EVENT', 'event');
define('TBL_TOOL_SETTINGS', 'tool_settings');
define('TBL_FAQ', 'faq');

define('TYPE_SKILL_BASE', array(1,2,12));
define('TYPE_SKILL_COMBAT', array(6,8,13));
define('TYPE_SKILL_MAGIC', array(4,5,11));
define('TYPE_SKILL_DIVINE', array(3,10));


$base_url = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') || isset($_ENV['FORCE_HTTPS'])) ? 'https' : 'http';
$base_url .= '://' . $_SERVER['HTTP_HOST'];
$base_url .= str_replace(basename($_SERVER['SCRIPT_NAME']), '',   $_SERVER['SCRIPT_NAME']);
defined('BASESEURL') || define('BASESEURL', $base_url);