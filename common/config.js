function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(key,value,exdays) {
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=encodeURIComponent(value) + ((exdays==null) ? "" : ";expires="+exdate.toUTCString());
    document.cookie=key + "=" + c_value;
}

function delCookie(key) {
    document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

DEBUG = true;
LOCATION = document.location.protocol + '//' + document.location.host;
LIBS_PATH = LOCATION + '/libs/';
COMMON_PATH = LOCATION + '/common/';
COMMON_CLASSES_PATH = COMMON_PATH + 'classes';
LOCALE = typeof getCookie('locale') == 'undefined' ? 'ru-ru': getCookie('locale');
setCookie('locale',LOCALE);

require.config({
    baseUrl: './',
    waitSeconds: 5,
    config: {
        i18n: {
            locale: LOCALE
        }
    },
    paths: {
        text:           LIBS_PATH + 'require/text',
        css:            LIBS_PATH + 'require/css',
        i18n:           LIBS_PATH + 'require/i18n',
        classes:        COMMON_CLASSES_PATH,
        common:         COMMON_PATH,
        libs:           LIBS_PATH,
        jquery:         LIBS_PATH + 'jquery/jquery.min',//be careful with $ version, seems to be version 1.10 has bugs with Deffered
        underscore:     LIBS_PATH + 'backbone/underscore.min',
        backbone:       LIBS_PATH + 'backbone/backbone',
        bootstrap:      LIBS_PATH + 'bootstrap/bootstrap.min',
//        storage:      LIBS_PATH + 'storage/storage',
//        jstorage:     LIBS_PATH + 'storage/jstorage',
        router:         COMMON_PATH + 'router',
        app:            LOCATION + '/app/'
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
        ,'bootstrap': ["jquery"]
        ,'underscore': {
            exports: '_'
        }
    }
});

//used as main app
require([
    'underscore'
    ,'libs/utils'
    ,'classes/Mediator'
    ,'app/AppModule'
], function(_, Utils, Mediator, AppModule){
    window.mediator = Mediator;

    window.app = new AppModule({id: 'app'});
    window.app.run();
});