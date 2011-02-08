/**
 * Cloud debugging tool
 *
 * @include cloudebug.js
 */
Ti.include("/Metal/debug/cloudebug.js");
//Ti.include('/Metal/debug/dumpObj.js');

// Define namepsace
metal.ns('metal.debug');

/**
 * Static singleton class for debugging
 *
 * @class debug
 * @singleton
 */
metal.debug = (function() {

    /**
     * @const {tcpClient} cloud
     */
    var cloud;
    
    /**
     * Fetch all this controls components
     * 
     * @param {Object} thisControl
     * @param [optional] {String} gap
     */
    function deepSearch(thisControl, gap) {
        var msg = '\n';
        gap = gap || '';
        for (var prop in thisControl) {
            var value = thisControl[prop];
            switch (typeof value) {
                case "function":
                    //msg +=  typeof value + ": " + prop + " = " + value + "\n";
                    break;

                case "object":
                    for (var prop2 in value) {
                        var value2 = value[prop2];
                        if (prop2 == "supr") {
                            var isGap = gap != '';
                            msg += gap + "[Superclass]:: [" + deepSearch(value2(), (isGap? '+' + gap : '+   ')) + ']\n';
                            continue;
                        }

                        switch (typeof value2) {
                            case "function":
                                msg += gap + '[Function] ' + prop2 + ' = ' + value2 + '\n';
                                break;
                            case 'object':
                                msg += gap + '[Property] ' + prop + ': {' + typeof value2 + '} ' + prop2 + ' = ' + value2 + '\n';
                                break;
                            default:
                                msg += gap + '[Inside-Property] ' + prop + ': {' + typeof value2 + '} ' + prop2 + ' = ' + value2 + '\n';
                                break;
                        }
                    }
                    break;

                default:
                    //msg += 'Property' + ': {' + typeof value + '} ' + prop + ' = ' + value + '\n';
                    break;

            }
        }

        return msg;
    }

    return {

        /**
         * @const {Integer} NONE
         */
        NONE : 0,

        /**
         * @const {Integer} DEBUG
         */
        DEBUG : 3,

        /**
         * @const {Integer} INFO
         */
        INFO : 2,

        /**
         * @const {Integer} ERROR
         */
        ERROR : 1,

        /**
         *
         * @property {Integer} state
         * @default false
         */
        state : metal.DEBUG_STATE,

        /**
         * Cloud debugging active state
         *
         * @private
         * @property {Boolean} cloudebug
         * @default false
         */
        cloudebug: false,

        /**
         * Debug INFO
         *
         * @param {String} win
         * @param {String} msg
         * @param [optional] {Object} obj Any obj that passed here will be stringify
         *        and added to the msg
         */
        info : function(win, msg, obj) {
            if (this.state >= this.INFO) {
                msg = (obj != undefined) ? (msg + deepSearch(obj)) : msg;
                Ti.API.info('[' + win + '] ' + msg);
                if (this.cloudebug == true) {
                    cloud.write('[info] ' + '[' + win + '] ' + msg);
                }
            }
        },
        debug: function(msg) {
            if (this.state >= this.DEBUG) {
                Ti.API.debug(msg);
                if (this.cloudbug == true) {
                    cloud.write('[debug] ' + msg);
                }
            }
        },
        /**
         * Initialize cloud debugging
         */
        initCloudebug : function() {
            // Connect to cloud debug if not already connected
            if (typeof cloud == "undefined") {
                var me = this;
                cloud = new tcpClient('251b3302-6fe6-4b25-9bc6-c7bfee2adfe7');
                cloud.newSocket();
                cloud.connect( function(e) {
                    me.info('debug', 'Cloudebug started');
                    me.cloudebug = true;
                });
            } else {
                this.info("Trying to start cloudebug... check your code!");
            }

        }
    }

})();
// If Cloud debugging is set to true, initialize it
if (metal.CLOUD_DEBUG == true) {
    metal.debug.initCloudebug();
}


