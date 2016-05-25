/**
 * Created by eyeos on 5/19/16.
 */

define(function () {

    var themeStyles = function() {
        this.insertStyle("themes/" + window.platformSettings.theme + "/css/login.css");
    };


    themeStyles.prototype.insertStyle = function(styleFile) {

        var newStyleInHead = styleFile;
        var stylesheet = document.createElement('link');
        stylesheet.rel = "stylesheet";
        stylesheet.type = "text/css";
        stylesheet.href = newStyleInHead;

        var head = document.getElementsByTagName('head')[0];
        head.appendChild(stylesheet);

        if (window.platformSettings.customTitle) {
            document.title = window.platformSettings.customTitle;
        }

    };

    return themeStyles;

});