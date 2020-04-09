var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*!
 * UAParser.js v0.7.20
 * Lightweight JavaScript-based User-Agent string parser
 * https://github.com/faisalman/ua-parser-js
 *
 * Copyright © 2012-2019 Faisal Salman <f@faisalman.com>
 * Licensed under MIT License
 */
(function (window, undefined) {
    "use strict";
    var LIBVERSION = "0.7.20", EMPTY = "", UNKNOWN = "?", FUNC_TYPE = "function", UNDEF_TYPE = "undefined", OBJ_TYPE = "object", STR_TYPE = "string", MAJOR = "major", MODEL = "model", NAME = "name", TYPE = "type", VENDOR = "vendor", VERSION = "version", ARCHITECTURE = "architecture", CONSOLE = "console", MOBILE = "mobile", TABLET = "tablet", SMARTTV = "smarttv", WEARABLE = "wearable", EMBEDDED = "embedded";
    var util = { extend: function (regexes, extensions) { var mergedRegexes = {}; for (var i in regexes) {
            if (extensions[i] && extensions[i].length % 2 === 0) {
                mergedRegexes[i] = extensions[i].concat(regexes[i]);
            }
            else {
                mergedRegexes[i] = regexes[i];
            }
        } return mergedRegexes; }, has: function (str1, str2) { if (typeof str1 === "string") {
            return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
        }
        else {
            return false;
        } }, lowerize: function (str) { return str.toLowerCase(); }, major: function (version) { return typeof version === STR_TYPE ? version.replace(/[^\d\.]/g, "").split(".")[0] : undefined; }, trim: function (str) { return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""); } };
    var mapper = { rgx: function (ua, arrays) { var i = 0, j, k, p, q, matches, match; while (i < arrays.length && !matches) {
            var regex = arrays[i], props = arrays[i + 1];
            j = k = 0;
            while (j < regex.length && !matches) {
                matches = regex[j++].exec(ua);
                if (!!matches) {
                    for (p = 0; p < props.length; p++) {
                        match = matches[++k];
                        q = props[p];
                        if (typeof q === OBJ_TYPE && q.length > 0) {
                            if (q.length == 2) {
                                if (typeof q[1] == FUNC_TYPE) {
                                    this[q[0]] = q[1].call(this, match);
                                }
                                else {
                                    this[q[0]] = q[1];
                                }
                            }
                            else if (q.length == 3) {
                                if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                    this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                }
                                else {
                                    this[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                }
                            }
                            else if (q.length == 4) {
                                this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                            }
                        }
                        else {
                            this[q] = match ? match : undefined;
                        }
                    }
                }
            }
            i += 2;
        } }, str: function (str, map) { for (var i in map) {
            if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                for (var j = 0; j < map[i].length; j++) {
                    if (util.has(map[i][j], str)) {
                        return i === UNKNOWN ? undefined : i;
                    }
                }
            }
            else if (util.has(map[i], str)) {
                return i === UNKNOWN ? undefined : i;
            }
        } return str; } };
    var maps = { browser: { oldsafari: { version: { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" } } }, device: { amazon: { model: { "Fire Phone": ["SD", "KF"] } }, sprint: { model: { "Evo Shift 4G": "7373KT" }, vendor: { HTC: "APA", Sprint: "Sprint" } } }, os: { windows: { version: { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" } } } };
    var regexes = { browser: [[/(opera\smini)\/([\w\.-]+)/i, /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i, /(opera).+version\/([\w\.]+)/i, /(opera)[\/\s]+([\w\.]+)/i], [NAME, VERSION], [/(opios)[\/\s]+([\w\.]+)/i], [[NAME, "Opera Mini"], VERSION], [/\s(opr)\/([\w\.]+)/i], [[NAME, "Opera"], VERSION], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i, /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i, /(?:ms|\()(ie)\s([\w\.]+)/i, /(rekonq)\/([\w\.]*)/i, /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon)\/([\w\.-]+)/i], [NAME, VERSION], [/(konqueror)\/([\w\.]+)/i], [[NAME, "Konqueror"], VERSION], [/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i], [[NAME, "IE"], VERSION], [/(edge|edgios|edga|edg)\/((\d+)?[\w\.]+)/i], [[NAME, "Edge"], VERSION], [/(yabrowser)\/([\w\.]+)/i], [[NAME, "Yandex"], VERSION], [/(puffin)\/([\w\.]+)/i], [[NAME, "Puffin"], VERSION], [/(focus)\/([\w\.]+)/i], [[NAME, "Firefox Focus"], VERSION], [/(opt)\/([\w\.]+)/i], [[NAME, "Opera Touch"], VERSION], [/((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i], [[NAME, "UCBrowser"], VERSION], [/(comodo_dragon)\/([\w\.]+)/i], [[NAME, /_/g, " "], VERSION], [/(windowswechat qbcore)\/([\w\.]+)/i], [[NAME, "WeChat(Win) Desktop"], VERSION], [/(micromessenger)\/([\w\.]+)/i], [[NAME, "WeChat"], VERSION], [/(brave)\/([\w\.]+)/i], [[NAME, "Brave"], VERSION], [/(qqbrowserlite)\/([\w\.]+)/i], [NAME, VERSION], [/(QQ)\/([\d\.]+)/i], [NAME, VERSION], [/m?(qqbrowser)[\/\s]?([\w\.]+)/i], [NAME, VERSION], [/(BIDUBrowser)[\/\s]?([\w\.]+)/i], [NAME, VERSION], [/(2345Explorer)[\/\s]?([\w\.]+)/i], [NAME, VERSION], [/(MetaSr)[\/\s]?([\w\.]+)/i], [NAME], [/(LBBROWSER)/i], [NAME], [/xiaomi\/miuibrowser\/([\w\.]+)/i], [VERSION, [NAME, "MIUI Browser"]], [/;fbav\/([\w\.]+);/i], [VERSION, [NAME, "Facebook"]], [/safari\s(line)\/([\w\.]+)/i, /android.+(line)\/([\w\.]+)\/iab/i], [NAME, VERSION], [/headlesschrome(?:\/([\w\.]+)|\s)/i], [VERSION, [NAME, "Chrome Headless"]], [/\swv\).+(chrome)\/([\w\.]+)/i], [[NAME, /(.+)/, "$1 WebView"], VERSION], [/((?:oculus|samsung)browser)\/([\w\.]+)/i], [[NAME, /(.+(?:g|us))(.+)/, "$1 $2"], VERSION], [/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i], [VERSION, [NAME, "Android Browser"]], [/(sailfishbrowser)\/([\w\.]+)/i], [[NAME, "Sailfish Browser"], VERSION], [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i], [NAME, VERSION], [/(dolfin)\/([\w\.]+)/i], [[NAME, "Dolphin"], VERSION], [/((?:android.+)crmo|crios)\/([\w\.]+)/i], [[NAME, "Chrome"], VERSION], [/(coast)\/([\w\.]+)/i], [[NAME, "Opera Coast"], VERSION], [/fxios\/([\w\.-]+)/i], [VERSION, [NAME, "Firefox"]], [/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i], [VERSION, [NAME, "Mobile Safari"]], [/version\/([\w\.]+).+?(mobile\s?safari|safari)/i], [VERSION, NAME], [/webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i], [[NAME, "GSA"], VERSION], [/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i], [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]], [/(webkit|khtml)\/([\w\.]+)/i], [NAME, VERSION], [/(navigator|netscape)\/([\w\.-]+)/i], [[NAME, "Netscape"], VERSION], [/(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i, /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i, /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i, /(links)\s\(([\w\.]+)/i, /(gobrowser)\/?([\w\.]*)/i, /(ice\s?browser)\/v?([\w\._]+)/i, /(mosaic)[\/\s]([\w\.]+)/i], [NAME, VERSION]], cpu: [[/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i], [[ARCHITECTURE, "amd64"]], [/(ia32(?=;))/i], [[ARCHITECTURE, util.lowerize]], [/((?:i[346]|x)86)[;\)]/i], [[ARCHITECTURE, "ia32"]], [/windows\s(ce|mobile);\sppc;/i], [[ARCHITECTURE, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i], [[ARCHITECTURE, /ower/, "", util.lowerize]], [/(sun4\w)[;\)]/i], [[ARCHITECTURE, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+[;l]))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i], [[ARCHITECTURE, util.lowerize]]], device: [[/\((ipad|playbook);[\w\s\),;-]+(rim|apple)/i], [MODEL, VENDOR, [TYPE, TABLET]], [/applecoremedia\/[\w\.]+ \((ipad)/], [MODEL, [VENDOR, "Apple"], [TYPE, TABLET]], [/(apple\s{0,1}tv)/i], [[MODEL, "Apple TV"], [VENDOR, "Apple"]], [/(archos)\s(gamepad2?)/i, /(hp).+(touchpad)/i, /(hp).+(tablet)/i, /(kindle)\/([\w\.]+)/i, /\s(nook)[\w\s]+build\/(\w+)/i, /(dell)\s(strea[kpr\s\d]*[\dko])/i], [VENDOR, MODEL, [TYPE, TABLET]], [/(kf[A-z]+)\sbuild\/.+silk\//i], [MODEL, [VENDOR, "Amazon"], [TYPE, TABLET]], [/(sd|kf)[0349hijorstuw]+\sbuild\/.+silk\//i], [[MODEL, mapper.str, maps.device.amazon.model], [VENDOR, "Amazon"], [TYPE, MOBILE]], [/android.+aft([bms])\sbuild/i], [MODEL, [VENDOR, "Amazon"], [TYPE, SMARTTV]], [/\((ip[honed|\s\w*]+);.+(apple)/i], [MODEL, VENDOR, [TYPE, MOBILE]], [/\((ip[honed|\s\w*]+);/i], [MODEL, [VENDOR, "Apple"], [TYPE, MOBILE]], [/(blackberry)[\s-]?(\w+)/i, /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i, /(hp)\s([\w\s]+\w)/i, /(asus)-?(\w+)/i], [VENDOR, MODEL, [TYPE, MOBILE]], [/\(bb10;\s(\w+)/i], [MODEL, [VENDOR, "BlackBerry"], [TYPE, MOBILE]], [/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone|p00c)/i], [MODEL, [VENDOR, "Asus"], [TYPE, TABLET]], [/(sony)\s(tablet\s[ps])\sbuild\//i, /(sony)?(?:sgp.+)\sbuild\//i], [[VENDOR, "Sony"], [MODEL, "Xperia Tablet"], [TYPE, TABLET]], [/android.+\s([c-g]\d{4}|so[-l]\w+)(?=\sbuild\/|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [MODEL, [VENDOR, "Sony"], [TYPE, MOBILE]], [/\s(ouya)\s/i, /(nintendo)\s([wids3u]+)/i], [VENDOR, MODEL, [TYPE, CONSOLE]], [/android.+;\s(shield)\sbuild/i], [MODEL, [VENDOR, "Nvidia"], [TYPE, CONSOLE]], [/(playstation\s[34portablevi]+)/i], [MODEL, [VENDOR, "Sony"], [TYPE, CONSOLE]], [/(sprint\s(\w+))/i], [[VENDOR, mapper.str, maps.device.sprint.vendor], [MODEL, mapper.str, maps.device.sprint.model], [TYPE, MOBILE]], [/(htc)[;_\s-]+([\w\s]+(?=\)|\sbuild)|\w+)/i, /(zte)-(\w*)/i, /(alcatel|geeksphone|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i], [VENDOR, [MODEL, /_/g, " "], [TYPE, MOBILE]], [/(nexus\s9)/i], [MODEL, [VENDOR, "HTC"], [TYPE, TABLET]], [/d\/huawei([\w\s-]+)[;\)]/i, /(nexus\s6p)/i], [MODEL, [VENDOR, "Huawei"], [TYPE, MOBILE]], [/(microsoft);\s(lumia[\s\w]+)/i], [VENDOR, MODEL, [TYPE, MOBILE]], [/[\s\(;](xbox(?:\sone)?)[\s\);]/i], [MODEL, [VENDOR, "Microsoft"], [TYPE, CONSOLE]], [/(kin\.[onetw]{3})/i], [[MODEL, /\./g, " "], [VENDOR, "Microsoft"], [TYPE, MOBILE]], [/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i, /mot[\s-]?(\w*)/i, /(XT\d{3,4}) build\//i, /(nexus\s6)/i], [MODEL, [VENDOR, "Motorola"], [TYPE, MOBILE]], [/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i], [MODEL, [VENDOR, "Motorola"], [TYPE, TABLET]], [/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i], [[VENDOR, util.trim], [MODEL, util.trim], [TYPE, SMARTTV]], [/hbbtv.+maple;(\d+)/i], [[MODEL, /^/, "SmartTV"], [VENDOR, "Samsung"], [TYPE, SMARTTV]], [/\(dtv[\);].+(aquos)/i], [MODEL, [VENDOR, "Sharp"], [TYPE, SMARTTV]], [/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i, /((SM-T\w+))/i], [[VENDOR, "Samsung"], MODEL, [TYPE, TABLET]], [/smart-tv.+(samsung)/i], [VENDOR, [TYPE, SMARTTV], MODEL], [/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i, /(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i, /sec-((sgh\w+))/i], [[VENDOR, "Samsung"], MODEL, [TYPE, MOBILE]], [/sie-(\w*)/i], [MODEL, [VENDOR, "Siemens"], [TYPE, MOBILE]], [/(maemo|nokia).*(n900|lumia\s\d+)/i, /(nokia)[\s_-]?([\w-]*)/i], [[VENDOR, "Nokia"], MODEL, [TYPE, MOBILE]], [/android[x\d\.\s;]+\s([ab][1-7]\-?[0178a]\d\d?)/i], [MODEL, [VENDOR, "Acer"], [TYPE, TABLET]], [/android.+([vl]k\-?\d{3})\s+build/i], [MODEL, [VENDOR, "LG"], [TYPE, TABLET]], [/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i], [[VENDOR, "LG"], MODEL, [TYPE, TABLET]], [/(lg) netcast\.tv/i], [VENDOR, MODEL, [TYPE, SMARTTV]], [/(nexus\s[45])/i, /lg[e;\s\/-]+(\w*)/i, /android.+lg(\-?[\d\w]+)\s+build/i], [MODEL, [VENDOR, "LG"], [TYPE, MOBILE]], [/(lenovo)\s?(s(?:5000|6000)(?:[\w-]+)|tab(?:[\s\w]+))/i], [VENDOR, MODEL, [TYPE, TABLET]], [/android.+(ideatab[a-z0-9\-\s]+)/i], [MODEL, [VENDOR, "Lenovo"], [TYPE, TABLET]], [/(lenovo)[_\s-]?([\w-]+)/i], [VENDOR, MODEL, [TYPE, MOBILE]], [/linux;.+((jolla));/i], [VENDOR, MODEL, [TYPE, MOBILE]], [/((pebble))app\/[\d\.]+\s/i], [VENDOR, MODEL, [TYPE, WEARABLE]], [/android.+;\s(oppo)\s?([\w\s]+)\sbuild/i], [VENDOR, MODEL, [TYPE, MOBILE]], [/crkey/i], [[MODEL, "Chromecast"], [VENDOR, "Google"]], [/android.+;\s(glass)\s\d/i], [MODEL, [VENDOR, "Google"], [TYPE, WEARABLE]], [/android.+;\s(pixel c)[\s)]/i], [MODEL, [VENDOR, "Google"], [TYPE, TABLET]], [/android.+;\s(pixel( [23])?( xl)?)[\s)]/i], [MODEL, [VENDOR, "Google"], [TYPE, MOBILE]], [/android.+;\s(\w+)\s+build\/hm\1/i, /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i, /android.+(mi[\s\-_]*(?:a\d|one|one[\s_]plus|note lte)?[\s_]*(?:\d?\w?)[\s_]*(?:plus)?)\s+build/i, /android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+))\s+build/i], [[MODEL, /_/g, " "], [VENDOR, "Xiaomi"], [TYPE, MOBILE]], [/android.+(mi[\s\-_]*(?:pad)(?:[\s_]*[\w\s]+))\s+build/i], [[MODEL, /_/g, " "], [VENDOR, "Xiaomi"], [TYPE, TABLET]], [/android.+;\s(m[1-5]\snote)\sbuild/i], [MODEL, [VENDOR, "Meizu"], [TYPE, MOBILE]], [/(mz)-([\w-]{2,})/i], [[VENDOR, "Meizu"], MODEL, [TYPE, MOBILE]], [/android.+a000(1)\s+build/i, /android.+oneplus\s(a\d{4})\s+build/i], [MODEL, [VENDOR, "OnePlus"], [TYPE, MOBILE]], [/android.+[;\/]\s*(RCT[\d\w]+)\s+build/i], [MODEL, [VENDOR, "RCA"], [TYPE, TABLET]], [/android.+[;\/\s]+(Venue[\d\s]{2,7})\s+build/i], [MODEL, [VENDOR, "Dell"], [TYPE, TABLET]], [/android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i], [MODEL, [VENDOR, "Verizon"], [TYPE, TABLET]], [/android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i], [[VENDOR, "Barnes & Noble"], MODEL, [TYPE, TABLET]], [/android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i], [MODEL, [VENDOR, "NuVision"], [TYPE, TABLET]], [/android.+;\s(k88)\sbuild/i], [MODEL, [VENDOR, "ZTE"], [TYPE, TABLET]], [/android.+[;\/]\s*(gen\d{3})\s+build.*49h/i], [MODEL, [VENDOR, "Swiss"], [TYPE, MOBILE]], [/android.+[;\/]\s*(zur\d{3})\s+build/i], [MODEL, [VENDOR, "Swiss"], [TYPE, TABLET]], [/android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i], [MODEL, [VENDOR, "Zeki"], [TYPE, TABLET]], [/(android).+[;\/]\s+([YR]\d{2})\s+build/i, /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i], [[VENDOR, "Dragon Touch"], MODEL, [TYPE, TABLET]], [/android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i], [MODEL, [VENDOR, "Insignia"], [TYPE, TABLET]], [/android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i], [MODEL, [VENDOR, "NextBook"], [TYPE, TABLET]], [/android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i], [[VENDOR, "Voice"], MODEL, [TYPE, MOBILE]], [/android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i], [[VENDOR, "LvTel"], MODEL, [TYPE, MOBILE]], [/android.+;\s(PH-1)\s/i], [MODEL, [VENDOR, "Essential"], [TYPE, MOBILE]], [/android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i], [MODEL, [VENDOR, "Envizen"], [TYPE, TABLET]], [/android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i], [VENDOR, MODEL, [TYPE, TABLET]], [/android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i], [MODEL, [VENDOR, "MachSpeed"], [TYPE, TABLET]], [/android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i], [VENDOR, MODEL, [TYPE, TABLET]], [/android.+[;\/]\s*TU_(1491)\s+build/i], [MODEL, [VENDOR, "Rotor"], [TYPE, TABLET]], [/android.+(KS(.+))\s+build/i], [MODEL, [VENDOR, "Amazon"], [TYPE, TABLET]], [/android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i], [VENDOR, MODEL, [TYPE, TABLET]], [/\s(tablet|tab)[;\/]/i, /\s(mobile)(?:[;\/]|\ssafari)/i], [[TYPE, util.lowerize], VENDOR, MODEL], [/[\s\/\(](smart-?tv)[;\)]/i], [[TYPE, SMARTTV]], [/(android[\w\.\s\-]{0,9});.+build/i], [MODEL, [VENDOR, "Generic"]]], engine: [[/windows.+\sedge\/([\w\.]+)/i], [VERSION, [NAME, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)/i], [[NAME, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, /(icab)[\/\s]([23]\.[\d\.]+)/i], [NAME, VERSION], [/rv\:([\w\.]{1,9}).+(gecko)/i], [VERSION, NAME]], os: [[/microsoft\s(windows)\s(vista|xp)/i], [NAME, VERSION], [/(windows)\snt\s6\.2;\s(arm)/i, /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i, /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i], [NAME, [VERSION, mapper.str, maps.os.windows.version]], [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i], [[NAME, "Windows"], [VERSION, mapper.str, maps.os.windows.version]], [/\((bb)(10);/i], [[NAME, "BlackBerry"], VERSION], [/(blackberry)\w*\/?([\w\.]*)/i, /(tizen)[\/\s]([\w\.]+)/i, /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|sailfish|contiki)[\/\s-]?([\w\.]*)/i], [NAME, VERSION], [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i], [[NAME, "Symbian"], VERSION], [/\((series40);/i], [NAME], [/mozilla.+\(mobile;.+gecko.+firefox/i], [[NAME, "Firefox OS"], VERSION], [/(nintendo|playstation)\s([wids34portablevu]+)/i, /(mint)[\/\s\(]?(\w*)/i, /(mageia|vectorlinux)[;\s]/i, /(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i, /(hurd|linux)\s?([\w\.]*)/i, /(gnu)\s?([\w\.]*)/i], [NAME, VERSION], [/(cros)\s[\w]+\s([\w\.]+\w)/i], [[NAME, "Chromium OS"], VERSION], [/(sunos)\s?([\w\.\d]*)/i], [[NAME, "Solaris"], VERSION], [/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i], [NAME, VERSION], [/(haiku)\s(\w+)/i], [NAME, VERSION], [/cfnetwork\/.+darwin/i, /ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i], [[VERSION, /_/g, "."], [NAME, "iOS"]], [/(mac\sos\sx)\s?([\w\s\.]*)/i, /(macintosh|mac(?=_powerpc)\s)/i], [[NAME, "Mac OS"], [VERSION, /_/g, "."]], [/((?:open)?solaris)[\/\s-]?([\w\.]*)/i, /(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i, /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms|fuchsia)/i, /(unix)\s?([\w\.]*)/i], [NAME, VERSION]] };
    var UAParser = function (uastring, extensions) { if (typeof uastring === "object") {
        extensions = uastring;
        uastring = undefined;
    } if (!(this instanceof UAParser)) {
        return new UAParser(uastring, extensions).getResult();
    } var ua = uastring || (window && window.navigator && window.navigator.userAgent ? window.navigator.userAgent : EMPTY); var rgxmap = extensions ? util.extend(regexes, extensions) : regexes; this.getBrowser = function () { var browser = { name: undefined, version: undefined }; mapper.rgx.call(browser, ua, rgxmap.browser); browser.major = util.major(browser.version); return browser; }; this.getCPU = function () { var cpu = { architecture: undefined }; mapper.rgx.call(cpu, ua, rgxmap.cpu); return cpu; }; this.getDevice = function () { var device = { vendor: undefined, model: undefined, type: undefined }; mapper.rgx.call(device, ua, rgxmap.device); return device; }; this.getEngine = function () { var engine = { name: undefined, version: undefined }; mapper.rgx.call(engine, ua, rgxmap.engine); return engine; }; this.getOS = function () { var os = { name: undefined, version: undefined }; mapper.rgx.call(os, ua, rgxmap.os); return os; }; this.getResult = function () { return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() }; }; this.getUA = function () { return ua; }; this.setUA = function (uastring) { ua = uastring; return this; }; return this; };
    UAParser.VERSION = LIBVERSION;
    UAParser.BROWSER = { NAME: NAME, MAJOR: MAJOR, VERSION: VERSION };
    UAParser.CPU = { ARCHITECTURE: ARCHITECTURE };
    UAParser.DEVICE = { MODEL: MODEL, VENDOR: VENDOR, TYPE: TYPE, CONSOLE: CONSOLE, MOBILE: MOBILE, SMARTTV: SMARTTV, TABLET: TABLET, WEARABLE: WEARABLE, EMBEDDED: EMBEDDED };
    UAParser.ENGINE = { NAME: NAME, VERSION: VERSION };
    UAParser.OS = { NAME: NAME, VERSION: VERSION };
    if (typeof exports !== UNDEF_TYPE) {
        if (typeof module !== UNDEF_TYPE && module.exports) {
            exports = module.exports = UAParser;
        }
        exports.UAParser = UAParser;
    }
    else {
        if (typeof define === "function" && define.amd) {
            define(function () { return UAParser; });
        }
        else if (window) {
            window.UAParser = UAParser;
        }
    }
    var $ = window && (window.jQuery || window.Zepto);
    if (typeof $ !== UNDEF_TYPE && !$.ua) {
        var parser = new UAParser;
        $.ua = parser.getResult();
        $.ua.get = function () { return parser.getUA(); };
        $.ua.set = function (uastring) { parser.setUA(uastring); var result = parser.getResult(); for (var prop in result) {
            $.ua[prop] = result[prop];
        } };
    }
})(typeof window === "object" ? window : this);
// / <reference path='../phaser.d.ts'/>
// / <reference path='./shaders/OutlinePipeline.ts'/>
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button(_scene, _x, _y, _tex, _upFrame, _callback, theName, hasRollver) {
        var _this = _super.call(this, _scene, _x, _y, _tex, _upFrame) || this;
        _this.clicked = false;
        _this.isSelected = false;
        // #UP,#DOWN or #BOTH
        _this.callWhen = 'both'; //default
        _this.rolloverColor = 0xffff99;
        _this.selectColor = 0x00FF00;
        _scene.add.existing(_this);
        _this.rollovedEnabled = hasRollver;
        _this.name = theName;
        _this.setOrigin(.5);
        _this.setInteractive();
        _this.on('pointerup', _this.pointerUp, _this);
        _this.on('pointerdown', _this.pointerDown, _this);
        _this.on('pointerover', _this.pointerOver, _this);
        _this.on('pointerout', _this.pointerOut, _this);
        _this.upFrame = _upFrame;
        _this.callback = _callback;
        _this.myScene = _scene;
        _this.clicked = false;
        _this.isSelected = false;
        _this.scene.input.on('pointerup', _this.generalPointerUp, _this);
        return _this;
    }
    Button.prototype.setMainTint = function (theTint) {
        this.mainTint = theTint;
        this.setTint(theTint);
    };
    Button.prototype.select = function (shoudAnimate) {
        if (shoudAnimate === void 0) { shoudAnimate = true; }
        //  if (kIOS_WRAPPED) {
        this.setTint(this.selectColor); //0xf6a45b);
        //}
        if (shoudAnimate) {
            var oldSclX = 1; //this.scaleX;
            var oldSclY = 1; //this.scaleY;
            this.setScale(0);
            this.myScene.tweens.add({
                targets: this,
                scaleX: oldSclX,
                scaleY: oldSclY,
                ease: 'Bounce.easeOut',
                duration: 300
            });
        }
        this.isSelected = true;
    };
    Button.prototype.deselect = function () {
        this.myClearTint();
        this.setTint(this.mainTint);
        this.isSelected = false;
    };
    Button.prototype.myClearTint = function () {
        if (this.mainTint == null) {
            this.clearTint();
        }
        else {
            this.setTint(this.mainTint);
        }
    };
    Button.prototype.bounce = function (dir, toSize) {
        var _this = this;
        if (toSize === void 0) { toSize = 1; }
        var oldSclX; // = this.scaleX;
        var oldSclY; // = this.scaleY;
        if (dir == 'in') {
            oldSclX = toSize; //this.scaleX;
            oldSclY = toSize; //this.scaleY;
            this.setScale(0);
        }
        else if (dir == 'out') {
            oldSclX = 0;
            oldSclY = 0;
        }
        this.myScene.tweens.add({
            targets: this,
            scaleX: oldSclX,
            scaleY: oldSclY,
            ease: 'Bounce.easeOut',
            duration: 300,
            onComplete: function () {
                if (dir == 'out') {
                    _this.setVisible(false);
                    _this.setScale(1);
                }
            }
        });
    };
    Button.prototype.enableRollover = function (how) {
        this.rollovedEnabled = how;
    };
    Button.prototype.pointerMove = function (pointer) {
        //  console.log(pointer.event.type);
    };
    Button.prototype.generalPointerUp = function (pointer) {
        if ((this.callWhen == 'up') || (this.callWhen == 'both')) {
            if (this.id == pointer.id) {
                var it = Phaser.Geom.Rectangle.Contains(this.getBounds(), pointer.upX, pointer.upY);
                if (!it) {
                    this.pointerUpOutside(pointer);
                }
            }
        }
    };
    Button.prototype.pointerUpOutside = function (pointer) {
        if ((this.callWhen == 'up') || (this.callWhen == 'both')) {
            //this.setFrame(this.upFrame);
            this.myClearTint(); //  setTint(0xffffff);
            // this.myScene.events.emit('screenButtonEvent', "up", this.name);
        }
    };
    Button.prototype.pointerUp = function (pointer) {
        // The reason I check for clicked is so I don't trigger the pointer up if
        // the mouse wasn't frist clicked on the button itself.
        // I check for pointer null when I send this event via keyboard control.  Null tells
        // me it's a keyup pressed custom event
        if ((this.callWhen == 'up') || (this.callWhen == 'both')) {
            if ((this.clicked == true) || (pointer == null)) {
                this.clicked = false;
                this.myClearTint(); //this.setTint(0xffffff);
                //this.setFrame(this.upFrame);
                // this.callback.call(this.myScene);
                if (this.callback) {
                    this.callback.call(this.myScene, 'up');
                }
                // this.myScene.events.emit('screenButtonEvent', "up", this.name);
            }
        }
    };
    Button.prototype.pointerDown = function (pointer) {
        if ((this.callWhen == 'down') || (this.callWhen == 'both')) {
            this.id = pointer.id;
            this.clicked = true;
            this.setTint(0x9df89d);
            // this.setFrame(this.downFrame);
            if (this.callback) {
                this.callback.call(this.myScene, 'down');
            }
            // this.myScene.events.emit('screenButtonEvent', "down", this.name);
        }
    };
    Button.prototype.pointerOver = function (pointer, x, y) {
        if (this.rollovedEnabled) {
            //this.setPipeline("Outline");
            // this.setFrame(this.overFrame);
            //  if (kIOS_WRAPPED) {
            this.setTint(this.rolloverColor);
            //  }
            // this.myScene.events.emit('rollover', this);
        }
    };
    Button.prototype.pointerOut = function (pointer) {
        if (this.rollovedEnabled) {
            //this.setFrame(this.upFrame);
            this.myClearTint(); //this.setTint(0x000000);
        }
    };
    // Leave this comment here for my reference 
    // b.setFrames('btn_sound_off.png', 'btn_sound_off.png', 'btn_sound_on.png', 'btn_sound_off.png');
    // used for switching up toggle states  
    Button.prototype.setFrames = function (_upFrame) {
        this.upFrame = _upFrame;
        this.setFrame(this.upFrame);
    };
    return Button;
}(Phaser.GameObjects.Sprite)); //end class
var PieMeter = /** @class */ (function (_super) {
    __extends(PieMeter, _super);
    // _scene:  the scene you want to display the meter in
    // _x, _y:  the position to display the meter
    // _radi:   the fadius of the meter
    // _dir:    the direction of the meter.  Value is either 1 or 0
    // _flip:   flips the meter horizontially and is used in conjunction with the _dir
    function PieMeter(_scene, _x, _y, _radi, _dir, _flip, _endValue) {
        var _this = _super.call(this, _scene, { x: _x, y: _y }) || this;
        _this.pieProgress = 0;
        _this.direction = 0;
        _this.color = 0x000000;
        _this.opacity = .5;
        _this.angle = 0;
        _this.alpha = .75;
        _this.scaleY = _flip;
        _this.setActive(true);
        _this.myRadius = _radi;
        _this.direction = _dir;
        _this.endValue = _endValue;
        _scene.add.existing(_this);
        return _this;
    }
    PieMeter.prototype.setColor = function (_color, _opacity) {
        this.color = _color;
        this.opacity = _opacity;
    };
    // constructor(_scene, _x: number, _y: number, _radi) {
    //     super(_scene, { x: _x, y: _y });
    //     // if error mode sure phaser.d.ts has Partial<GraphicsStyles> of graphicsOptions
    //     this.angle = 0;
    //     this.alpha = .15;
    //     this.scaleY = -1;
    //     this.setActive(true);
    //     this.myRadius = _radi;
    //     _scene.add.existing(this);
    // }
    PieMeter.prototype.drawPieStatic = function (amount) {
        if (this.visible == false)
            this.visible = true;
        this.pieProgress = amount;
        this.clear();
        this.fillStyle(this.color, this.opacity);
        var radius = this.myRadius;
        this.angle = -90;
        this.slice(0, 0, radius, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(360 * this.pieProgress), true);
        this.fillPath();
        return this.pieProgress;
    };
    //return number bt 0 and 1.0
    PieMeter.prototype.getValue = function () {
        return this.pieProgress / 360.0;
    };
    // should be bt 0 and 1.0
    PieMeter.prototype.setValue = function (howMuch) {
        this.pieProgress = howMuch * 360.0;
    };
    PieMeter.prototype.drawPie = function (howMuch, increase) {
        if (this.visible == false)
            this.visible = true;
        if ((increase == true) || (increase == null)) {
            this.pieProgress += howMuch;
        }
        else {
            this.pieProgress = howMuch;
        }
        this.clear();
        this.fillStyle(this.color, this.opacity);
        var radius = this.myRadius;
        this.angle = -90;
        this.slice(0, 0, radius, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(this.pieProgress), true);
        this.fillPath();
        return this.pieProgress / 360.0;
        // }
    };
    PieMeter.prototype.drawPie2 = function (howMuch) {
        if (this.visible == false)
            this.visible = true;
        this.clear();
        this.fillStyle(this.color, this.opacity);
        var radius = this.myRadius;
        // Rotate to make 0 as 12 o'clock
        this.angle = -90;
        this.pieProgress = (360 / this.endValue * howMuch);
        if (this.direction == 0) {
            this.slice(0, 0, radius, 0, Phaser.Math.DegToRad(this.pieProgress), true);
        }
        else {
            this.slice(0, 0, radius, Phaser.Math.DegToRad(this.pieProgress), 0, true);
        }
        this.fillPath();
    };
    PieMeter.prototype.reset = function () {
        this.pieProgress = 0;
        // this.visible = false;
    };
    return PieMeter;
}(Phaser.GameObjects.Graphics));
var BootScene = /** @class */ (function (_super) {
    __extends(BootScene, _super);
    function BootScene() {
        return _super.call(this, { key: 'BootScene' }) || this;
    }
    BootScene.prototype.preload = function () {
        this.load.setPath('assets/images/');
        this.load.image('logo', 'taara-logo.png');
        // this.load.image('preloadBar', 'progressBar.png', null);
        // this.load.image('preloadBarMask', 'progressBarMask.png', null);
        this.load.on('complete', function () {
            this.scene.start('PreloadScene');
        }, this);
    };
    return BootScene;
}(Phaser.Scene));
var MoreGamesScene = /** @class */ (function (_super) {
    __extends(MoreGamesScene, _super);
    function MoreGamesScene() {
        return _super.call(this, { key: 'MoreGamesScene' }) || this;
    }
    MoreGamesScene.prototype.preload = function () {
    };
    MoreGamesScene.prototype.create = function () {
        gGameState = states.kSTATE_MOREGAMES;
        var mo = this.scene.get('MenuOverlay');
        mo.scoreText.setVisible(false);
        mo.highScoreText.setVisible(false);
        this.add.image(0, 0, 'spriteAtlas', 'help_en.png').setOrigin(0, 0);
    };
    return MoreGamesScene;
}(Phaser.Scene));
var SettingsScene = /** @class */ (function (_super) {
    __extends(SettingsScene, _super);
    function SettingsScene() {
        return _super.call(this, { key: 'SettingsScene' }) || this;
    }
    SettingsScene.prototype.preload = function () {
    };
    SettingsScene.prototype.create = function () {
        gGameState = states.kSTATE_SETTINGS;
        var mo = this.scene.get('MenuOverlay');
        mo.scoreText.setVisible(false);
        mo.highScoreText.setVisible(false);
        this.add.image(0, 0, 'spriteAtlas', 'help_en.png').setOrigin(0, 0);
    };
    return SettingsScene;
}(Phaser.Scene));
var PreloadScene = /** @class */ (function (_super) {
    __extends(PreloadScene, _super);
    function PreloadScene() {
        return _super.call(this, { key: 'PreloadScene' }) || this;
    }
    PreloadScene.prototype.preload = function () {
        AAKaiAds.preLoadDisplayAd();
        //    AAKaiAds.preLoadBannerAd();
        this.cameras.main.setBackgroundColor(0xFFDD18);
        var logo = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, "logo").setAlpha(0);
        this.tweens.add({
            targets: logo,
            alpha: 1.0,
            duration: 100,
            ease: 'Power.easeIn'
        });
        var meterBarbg = this.add.graphics();
        var topOfBar = 70;
        var bottomOfBar = 25;
        meterBarbg.beginPath();
        meterBarbg.moveTo(0, this.sys.game.canvas.height - topOfBar);
        meterBarbg.lineTo(this.sys.canvas.width, this.sys.game.canvas.height - topOfBar);
        meterBarbg.lineTo(this.sys.canvas.width, this.sys.game.canvas.height - bottomOfBar);
        meterBarbg.lineTo(0, this.sys.game.canvas.height - bottomOfBar);
        meterBarbg.closePath();
        meterBarbg.strokePath();
        meterBarbg.fillStyle(0x000000, 1);
        meterBarbg.fill();
        ///
        this.meterBar = this.add.graphics();
        this.meterBar.beginPath();
        this.meterBar.moveTo(0, this.sys.game.canvas.height - topOfBar);
        this.meterBar.lineTo(this.sys.canvas.width, this.sys.game.canvas.height - topOfBar);
        this.meterBar.lineTo(this.sys.canvas.width, this.sys.game.canvas.height - bottomOfBar);
        this.meterBar.lineTo(0, this.sys.game.canvas.height - bottomOfBar);
        this.meterBar.closePath();
        this.meterBar.strokePath();
        this.meterBar.fillStyle(0xff0000, 1.0);
        this.meterBar.fill();
        this.meterBar.scaleX = .1;
        this.kitt = this.add.graphics();
        this.kitt.moveTo(0, this.sys.game.canvas.height - topOfBar);
        this.kitt.lineTo(20, this.sys.game.canvas.height - topOfBar);
        this.kitt.lineTo(20, this.sys.game.canvas.height - bottomOfBar);
        this.kitt.lineTo(0, this.sys.game.canvas.height - bottomOfBar);
        this.kitt.closePath();
        this.kitt.strokePath();
        this.kitt.fillStyle(0xffffff, 1.0);
        this.kitt.fill();
        this.tweens.add({
            targets: this.kitt,
            x: this.sys.canvas.width - 10,
            ease: 'Sine.easeInOut',
            yoyo: true,
            duration: 500,
            repeat: -1
        });
        this.loadAssets();
    };
    PreloadScene.prototype.loadAssets = function () {
        this.load.on('progress', function (it) {
            this.meterBar.scaleX = this.load.progress;
        }, this);
        this.load.on('complete', function () {
            this.meterBar.fillStyle(0x00A800, 1.0);
            this.meterBar.fill();
            this.meterBar.scaleX = 1.0;
            AAFunctions.fade(this, "out", 500, this.goToGameScene, gLogoDisplayLength);
        }, this);
        // *** LOAD ASSETS ***
        // ========================================================================
        // 3/30/20
        // commented this out as I'm trying out banner kaios ads
        // ========================================================================
        // let d = '?' + new Date().getTime();
        // this.load.text('sponsorURL', 'https://taara.games/sponsor.txt' + d);
        // this.load.image('sponsor', 'https://taara.games/sponsor.png' + d);
        // Spritesheets
        this.load.setPath("assets/images/");
        this.load.atlas("spriteAtlas", "spriteAtlas.png", "spriteAtlas.json", null, null);
        // this.load.image('gamefont', 'numbers.png');
        this.load.bitmapFont('sysFont', 'retroSystem.png', 'retroSystem.fnt', null, null);
        // this.load.image('coverart', 'coverart.png');
        //Fonts
        this.load.image('numbersFont', 'numbers@2x.png');
        //Sound Effects
        this.load.setPath("assets/audio/");
        var ext = '.ogg';
        // These two sounds are the standard button sounds
        this.load.audio("button", "click" + ext);
        // this.load.audio("buttonNav", "chime-triad" + ext);
    };
    PreloadScene.prototype.goToGameScene = function (a, c, b, d) {
        this.scene.start('MenuScene');
        this.scene.start('MenuOverlay');
        this.scene.start('SponsorOverlay');
        // switch (true) {
        //     // this.sys.game.device.os.chromeOS     // Is running on chromeOS?
        //     // this.sys.game.device.os.cordova      // Is the game running under Apache Cordova?
        //     // this.sys.game.device.os.crosswalk    // Is the game running under the Intel Crosswalk XDK?
        //     // this.sys.game.device.os.ejecta       // Is the game running under Ejecta?
        //     // this.sys.game.device.os.electron     // Is the game running under GitHub Electron?
        //     case this.sys.game.device.os.desktop:      // Is running on a desktop?
        //     case this.sys.game.device.os.android:     // Is running on android?
        //     case this.sys.game.device.os.iOS:         // Is running on iOS?
        //     case this.sys.game.device.os.iPad:        // Is running on iPad?
        //     case this.sys.game.device.os.iPhone:       // Is running on iPhone?
        //     case this.sys.game.device.os.kindle:      // Is running on an Amazon Kindle?
        //     case this.sys.game.device.os.linux:     // Is running on linux?
        //     case this.sys.game.device.os.macOS:    // Is running on macOS?
        //     case this.sys.game.device.os.webApp:   // Set to true if running as a WebApp, i.e. within a case WebView
        //     case this.sys.game.device.os.windows:      // Is running on windows?
        //     case this.sys.game.device.os.windowsPhone: // Is running on a Windows Phone?
        //     // this.sys.game.device.os.node         // Is the game running under Node.js?
        //     // this.sys.game.device.os.nodeWebkit   // Is the game running under Node-/Webkit?
        //     case gRunnngInBrowser:
        //         this.scene.start('SponsorOverlay');
        //         break;
        // }
        // AAKaiAds.displayFullscreenAd();
        // AAKaiAds.preLoadDisplayAd();
    };
    return PreloadScene;
}(Phaser.Scene));
var MenuOverlay = /** @class */ (function (_super) {
    __extends(MenuOverlay, _super);
    function MenuOverlay() {
        var _this = _super.call(this, { key: 'MenuOverlay' }) || this;
        // debugText;
        // debugInfo;
        _this.kHideDistance = 350;
        _this._SHOWFPS = false;
        _this.pauseEnabled = false;
        return _this;
    }
    MenuOverlay.prototype.preload = function () {
        // Get the Prefs & high score
        AAPrefs.initGamePrefs(gamePrefsFile);
        AAHighScores.initHighScores();
        // AAKaiAds.displayFullscreenAd();
        AAKaiAds.preLoadBannerAd();
    };
    MenuOverlay.prototype.create = function () {
        AAKaiControls.setUpInputs(this);
        this.setUpAudio();
        this.setUpUI();
        gGameState = states.kSTATE_MENU;
        this.removeAllListeners();
        this.events.on('gameover', this.gameover, this);
        this.events.on('setscore', this.setScore, this);
        this.events.on('setscorefloat', this.setScoreFloat, this);
        // IMPORTANT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // THIS IS CALLED FROM THE FIREFOX UI WHEN A USER CLICKS "EXIT"
        emitter.on('fullscreen', this.action_btnFullscreen, this);
        emitter.on('keydown', this.keydown, this);
        emitter.on('keyup', this.keyup, this);
        // var txt = [
        //     "window innerHeight: " + window.innerHeight + " ",
        //     "window innerWidth: " + window.innerWidth + " ",
        //     "document.referrer: " + document.referrer + " ",
        //     "document.fullscreenEnabled: " + document.fullscreenEnabled + " ",
        //     "document.documentElement.clientHeight: " + document.documentElement.clientHeight + " ",
        //     "document.documentElement.clientWidth: " + document.documentElement.clientWidth + " ",
        // ];
    };
    MenuOverlay.prototype.removeAllListeners = function () {
        this.events.removeListener('gameover');
        this.events.removeListener('setscore');
        this.events.removeListener('setscorefloat');
        emitter.removeListener('fullscreen');
        emitter.removeListener('keyDown');
        emitter.removeListener('keyUp');
    };
    MenuOverlay.prototype.keydown = function (theKeyEvent) {
        if ((this.transitioning) || (AAFunctions.areButtonsBouncing())) {
            return;
        }
        if (gGameState != states.kSTATE_MENU) {
            if (theKeyEvent.key == "Backspace") {
                theKeyEvent.preventDefault();
            }
        }
        switch (theKeyEvent.key) {
            case "1": //help
            case "2": //play 
            case "3": //sound
            case "4": //settings
            case "5": //moregames
            case "#": //fullscreen
            case "8": //sponsor
                theKeyEvent.preventDefault();
                break;
        }
    };
    MenuOverlay.prototype.keyup = function (theKeyEvent) {
        if ((this.transitioning) || (AAFunctions.areButtonsBouncing())) {
            return;
        }
        var theKey = theKeyEvent.key;
        switch (gGameState) {
            case states.kSTATE_MENU:
            case states.kSTATE_GAMEOVER:
                this.checkMenuControls(theKey);
                break;
            case states.kSTATE_PLAYING:
                this.checkForPause(theKey);
                break;
            case states.kSTATE_PAUSED:
                this.checkPauseControls(theKey);
                this.checkForPause(theKey);
                break;
            case states.kSTATE_MOREGAMES:
            case states.kSTATE_SETTINGS:
            case states.kSTATE_HELP:
                this.checkHelpControls(theKey);
                break;
        }
        if (theKeyEvent.key == "SoftRight") {
            // this.action_sponsorButton("up");
            this.scene.get("SponsorOverlay").action_sponsorButton("up");
        }
        if (theKeyEvent.key == "Backspace") {
            switch (gGameState) {
                case states.kSTATE_MENU:
                    // if (theKeyEvent.key == "Backspace") {
                    AAKaiAnalytics.sendEvent("exitgame");
                    window.close();
                    // }
                    break;
                case states.kSTATE_GAMEOVER:
                case states.kSTATE_PLAYING:
                    this.showButton(this.c_btnHelp, this.buttonY, this.c_btnHelp.x);
                    this.resetByBackSpace();
                    theKeyEvent.preventDefault();
                    break;
            }
        }
        switch (theKeyEvent.key) {
            case "1": //help
            case "2": //play 
            case "3": //sound
            case "4": //settings
            case "5": //moregames
            case "#": //fullscreen
            case "8": //sponsor
                theKeyEvent.preventDefault();
                break;
        }
    };
    MenuOverlay.prototype.setUpAudio = function () {
        this.sfxButton = this.sound.add('button');
    };
    MenuOverlay.prototype.resetByBackSpace = function () {
        this.playBtnSnd();
        AAKaiAnalytics.sendEvent("quitgame");
        this.resetToMenu();
    };
    //Set the game to it's initial state by initializing all the variables
    MenuOverlay.prototype.reset = function () {
        AAKaiAnalytics.sendEvent("play");
        this.gameoverSprite.setVisible(false);
        this.hideAllButtons();
        if (this.pauseEnabled) {
            this.btnPause.setVisible(true);
        }
        var restartFromAd = false;
        this.scene.get("MenuScene").scene.start("GameScene", { restartFromAd: restartFromAd });
        this.scene.get("SponsorOverlay").hideBanner();
    };
    MenuOverlay.prototype.resetFromGame = function () {
        AAKaiAnalytics.sendEvent("back-paused");
        this.resetToMenu();
        this.scene.stop('GameScene');
    };
    MenuOverlay.prototype.resetFromHelpBackButton = function (_theScene) {
        if ((this.transitioning) || (AAFunctions.areButtonsBouncing())) {
            return;
        }
        this.playBtnSnd();
        gGameState = states.kSTATE_MENU;
        this.hideTopPlaySoundButtons(this.buttonY);
        this.hideTopRowOfButtons(this.buttonY2);
        this.btnHelp.setTexture('spriteAtlas', 'btnHelp.png');
        AAFunctions.tweenBounce(this, this.c_btnHelp);
        if (false == this.scoreText.visible) {
            this.scoreText.setVisible(true);
            this.highScoreText.setVisible(true);
        }
        this.scene.get("SponsorOverlay").showBanner();
        this.scene.get(_theScene).scene.start("MenuScene");
        AAKaiAnalytics.sendEvent("back-help");
    };
    MenuOverlay.prototype.resetToMenu = function () {
        if (this.transitioning) {
            return;
        }
        gGameState = states.kSTATE_MENU;
        //hide the game over sprite
        this.gameoverSprite.setVisible(false);
        AAFunctions.tweenBounce(this, this.c_btnHelp);
        this.btnHelp.setTexture('spriteAtlas', 'btnHelp.png');
        this.hideTopPlaySoundButtons(this.buttonY);
        this.hideTopRowOfButtons(this.buttonY2);
        if (this.pauseEnabled) {
            this.btnPause.setVisible(false);
            this.pauseImage.setVisible(false);
        }
        // this.btnPause.setVisible(false);
        this.scene.get("GameScene").scene.start("MenuScene");
        this.scene.get("SponsorOverlay").showBanner();
    };
    MenuOverlay.prototype.gameover = function () {
        gGameState = states.kSTATE_GAMEOVER;
        this.btnHelp.setTexture('spriteAtlas', 'btnBack.png');
        //Show the reset button
        this.showButtons(true);
        // Hide the pause button
        if (this.pauseEnabled) {
            this.btnPause.setVisible(false);
        }
        // show the gameover image
        // I don't need to store it since I'm just restarting the scene
        this.gameoverSprite.setVisible(true);
        AAFunctions.tweenBounce(this, this.gameoverSprite);
        this.singlePress = true;
        this.scene.get("SponsorOverlay").showBanner();
    };
    MenuOverlay.prototype.checkForPause = function (theKey) {
        if (this.pauseEnabled) {
            if (!this.areButtonsTweening()) {
                // if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
                if (theKey == "*") {
                    this.singlePress = true;
                    this.action_btnPause("up");
                }
            }
        }
    };
    // This check for the center button when the help scene is displayed
    // and then take you back home to the main menu;
    MenuOverlay.prototype.checkHelpControls = function (theKey) {
        if (theKey == "1") {
            switch (gGameState) {
                case states.kSTATE_HELP:
                    this.resetFromHelpBackButton("HelpScene");
                case states.kSTATE_MOREGAMES:
                    this.resetFromHelpBackButton("MoreGamesScene");
                    break;
                case states.kSTATE_SETTINGS:
                    this.resetFromHelpBackButton("SettingsScene");
                    break;
            }
            this.singlePress = true;
        }
        if (theKey == "*") {
            this.singlePress = true;
            this._SHOWFPS = !this._SHOWFPS;
            this.fpsText.visible = !this.fpsText.visible;
        }
    };
    MenuOverlay.prototype.checkPauseControls = function (theKey) {
        if (theKey == "1") {
            this.btnHelp.pointerUp(null);
        }
    };
    MenuOverlay.prototype.checkMenuControls = function (theKey) {
        if (gAdShowing) {
            return;
        }
        ;
        switch (theKey) {
            case "8":
                this.visitSponsor();
                break;
            case "Enter":
            case "2":
                this.btnPlay.pointerUp(null);
                break;
            // case "SoftRight":
            case "3":
                this.btnSound.pointerUp(null);
                break;
            //case "SoftLeft":
            case "1":
                // if (gAdShowing == false) 
                this.btnHelp.pointerUp(null);
                // }
                break;
            case "4":
                if (kSHOW_SETTINGS_BUTTON) {
                    this.btnSettings.pointerUp(null);
                }
                break;
            case "5":
                this.btnMoreGames.pointerUp(null);
                break;
            case "#":
                if (kSHOW_FULLSCREEN_BUTTON) {
                    this.action_btnFullscreen("up");
                }
                break;
        }
    };
    MenuOverlay.prototype.checkGameOverMenuControls = function (theKey) {
        if (gGameState == states.kSTATE_GAMEOVER_DELAY) {
            return;
        }
        switch (theKey) {
            case "Enter":
            case "=":
                this.btnPlay.pointerUp(null);
                break;
            // case "SoftRight":
            case "3":
                this.btnSound.pointerUp(null);
                break;
            // case "SoftLeft":
            case "1":
                this.btnHelp.pointerUp(null);
                break;
        }
    };
    MenuOverlay.prototype.showButton = function (who, ly, lx) {
        var scaleSpeed = 150;
        // reset the scales of the button to 1.0 to avoid weird scaling issues
        who.scaleX = 1.0;
        who.scaleY = 1.0;
        var _y = ly;
        var _x = lx;
        var theEase = 'BounceInOut';
        var xthis = this;
        this.buttonTween = this.tweens.add({
            targets: who,
            y: { value: _y, duration: scaleSpeed, ease: theEase },
            x: { value: _x, duration: scaleSpeed, ease: theEase },
        });
    };
    // **************************************************************************
    // SET UP THE UI
    // **************************************************************************
    MenuOverlay.prototype.setUpUI = function () {
        var isVis = true;
        var numBadge;
        // Play Button #######################################################################
        this.btnPlay = new Button(this, 0, 0, 'spriteAtlas', 'btnPlay.png', this.action_BtnPlay, "play", true).setVisible(isVis);
        numBadge = this.add.image(0, -50, "spriteAtlas", "tag2.png").setVisible(isKaiOS);
        this.c_btnPlay = this.add.container(0, 0, [this.btnPlay, numBadge]).setVisible(isVis);
        // Sound Button #######################################################################
        var whichButton = 'btnSoundOff.png';
        if (AAPrefs.playAudio) {
            whichButton = 'btnSoundOn.png';
        }
        this.btnSound = new Button(this, 0, 5, 'spriteAtlas', whichButton, this.action_btnSound, "sound", true).setVisible(isVis);
        numBadge = this.add.image(0, -34, "spriteAtlas", "tag3.png").setVisible(isKaiOS);
        this.c_btnSound = this.add.container(this.cameras.main.width - 10, this.cameras.main.height - 10, [this.btnSound, numBadge]).setVisible(isVis);
        // Help/Back Button #######################################################################
        whichButton = 'btnHelp.png';
        this.btnHelp = new Button(this, 0, 5, 'spriteAtlas', whichButton, this.action_BtnHelpBack, "help", true).setVisible(true);
        numBadge = this.add.image(0, -34, "spriteAtlas", "tag1.png").setVisible(isKaiOS);
        this.c_btnHelp = this.add.container(15, this.cameras.main.height - 10, [this.btnHelp, numBadge]).setVisible(true);
        // Settings Button #######################################################################
        whichButton = 'btnSettings.png';
        this.btnSettings = new Button(this, 0, 5, 'spriteAtlas', whichButton, this.action_btnSettings, "settings", true).setVisible(true);
        numBadge = this.add.image(0, -34, "spriteAtlas", "tag4.png").setVisible(isKaiOS);
        this.c_btnSettings = this.add.container(15, this.cameras.main.height - 10, [this.btnSettings, numBadge]).setVisible(kSHOW_SETTINGS_BUTTON);
        // More Games Button #######################################################################
        this.btnMoreGames = new Button(this, 0, 0, 'spriteAtlas', 'btnMoreGames.png', this.action_btnMoreGames, "more", true).setVisible(isVis);
        numBadge = this.add.image(0, -40, "spriteAtlas", "tag5.png").setVisible(isKaiOS);
        this.c_btnMoreGames = this.add.container(0, 0, [this.btnMoreGames, numBadge]).setVisible(isVis);
        // Fullscreen Button #######################################################################
        this.btnFullscreen = new Button(this, 0, 5, 'spriteAtlas', 'btnFullscreenOn.png', this.action_btnFullscreen, "fullscreen", true).setVisible(isVis);
        numBadge = this.add.image(0, -34, "spriteAtlas", "tag#.png").setVisible(isKaiOS);
        this.c_btnFullScreen = this.add.container(this.cameras.main.width - 10, this.cameras.main.height - 10, [this.btnFullscreen, numBadge]).setVisible(kSHOW_FULLSCREEN_BUTTON);
        // Pause Button #######################################################################
        whichButton = 'btnPause.png';
        this.btnPause = new Button(this, this.cameras.main.width - 35, 20, 'spriteAtlas', whichButton, this.action_btnPause, "pause", true).setVisible(false);
        // // Sponsor Button #####################################################################
        // this.btnSponsor = new Button(this, this.sys.canvas.width - 60, this.sys.canvas.height, 'spriteAtlas', "sponsor.png", this.action_sponsorButton, "sponsor", true).setVisible(true).setOrigin(.5, 1);
        // DISPLAY BUTTONS #######################################################################
        // #######################################################################################
        // HELP -- PLAY -- SOUND
        this.buttonY = (this.cameras.main.height - 90);
        AAFunctions.displayButtons([this.c_btnHelp, this.c_btnPlay, this.c_btnSound], this.cameras.main, this.buttonY, 60);
        // SETTINGS -- MORE GAMES -- FULLSCREEN
        this.buttonY2 = (this.cameras.main.height - 210);
        AAFunctions.displayButtons([this.c_btnSettings, this.c_btnMoreGames, this.c_btnFullScreen], this.cameras.main, this.buttonY2, 0);
        // Pause Graphic #######################################################################
        this.createPauseGrc();
        // GameOver Sprite #######################################################################
        this.gameoverSprite = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2.5, 'spriteAtlas', 'gameover.png').setVisible(false);
        // Number Font #######################################################################
        this.makeTheNumbersFont();
        // Score Text #######################################################################
        var scoreSize = 15 * 2;
        this.scoreText = this.add.bitmapText(9, 6, 'numbersFont', '0', scoreSize).setDepth(999);
        this.scoreText.setOrigin(0);
        this.scoreText.setTint(0xffffff);
        // this.scoreText.scaleX = .5;
        // this.scoreText.scaleY = .5;
        // HighScore Text #######################################################################
        scoreSize = 8 * 2;
        this.highScoreText = this.add.bitmapText(12, 25 * 2, 'numbersFont', AAHighScores.highScore, scoreSize).setDepth(999);
        this.highScoreText.setOrigin(0);
        this.highScoreText.setTint(0xcccccc);
        // this.highScoreText.scaleX = .5;
        // t5his.highScoreText.scaleY = .5;
        // FPS TEXT #######################################################################
        // if (gSHOWFPS) {
        this.fpsText = this.add.bitmapText(9, 80, 'numbersFont', '0.0', 15).setVisible(false);
        this.fpsText.setTint(0x666666);
        // }
        // this.debugInfo = this.add.bitmapText(10, 130, 'numbersFont', '0', scoreSize).setDepth(999);
    };
    MenuOverlay.prototype.makeTheNumbersFont = function () {
        var config = {
            image: 'numbersFont',
            width: 40,
            height: 40,
            offset: { x: 0 },
            chars: '0123456789.',
            charsPerRow: 11
        };
        // I have to put the <any> here because the typescript defs have an error
        // somewhere that won't let me use the param unless I add <any>
        var it = Phaser.GameObjects.RetroFont.Parse(this, config);
        this.cache.bitmapFont.add('numbersFont', it);
    };
    MenuOverlay.prototype.playBtnSnd = function () {
        if (AAPrefs.playAudio == true)
            this.sfxButton.play();
    };
    // playNavSnd() {
    //     if (AAPrefs.playAudio == true)
    //         this.sfxButtonNav.play();
    // }
    MenuOverlay.prototype.showButtons = function (isGameOver) {
        if (!this.areButtonsTweening()) {
            if (isGameOver) {
                this.showButton(this.c_btnSound, this.buttonY, this.c_btnSound.x);
                this.showButton(this.c_btnHelp, this.buttonY, this.c_btnHelp.x);
            }
            this.showButton(this.c_btnPlay, this.buttonY, this.c_btnPlay.x);
            // Hilight and select the button to make the keyboard work
            //this.btnPlay.select(false);
        }
    };
    MenuOverlay.prototype.areButtonsTweening = function () {
        var isATweeing = false;
        if (this.buttonTween != null) {
            isATweeing = this.buttonTween.isPlaying();
        }
        if (gTween != null) {
            isATweeing = gTween.isPlaying();
        }
        return isATweeing;
    };
    MenuOverlay.prototype.hideAllButtons = function () {
        if (!this.areButtonsTweening()) {
            var where = this.sys.game.canvas.height + 150;
            this.hideTopPlaySoundButtons(this.buttonY + where);
            this.showButton(this.c_btnHelp, this.buttonY + where, this.c_btnHelp.x);
            this.hideTopRowOfButtons(this.buttonY2 + where);
        }
    };
    // I some times won't need with either full screen or the settings button.
    // ALWAYS show HELP - PLAY - SOUND - MOREGAMES
    MenuOverlay.prototype.buttonSetVisible = function (who, how) {
        switch (who) {
            case 'settings':
                this.c_btnSettings.setVisible(how);
                break;
            case "fullscreen":
                this.c_btnFullScreen.setVisible(how);
            default:
                break;
        }
    };
    MenuOverlay.prototype.update = function (time, delta) {
        if (this._SHOWFPS) {
            this.fpsText.setText('FPS: ' + (1000 / delta).toFixed(1));
        }
        // if (this.debugInfo) {
        //     this.debugInfo.setText([
        //         'GameData.rockcount: ' + GameData.rockCount
        //         this.bigRocks
        //     ]);
        //     // this.debugText.text = gGameState.toString();
        // }
    };
    MenuOverlay.prototype.setScore = function (data) {
        var thescore = data[0];
        this.displayScore(thescore);
    };
    MenuOverlay.prototype.setScoreFloat = function (data) {
        var thescore = data[0].toFixed(2);
        this.displayScore(thescore);
    };
    MenuOverlay.prototype.displayScore = function (thescore) {
        this.scoreText.text = thescore.toString();
        if (thescore >= AAHighScores.highScore) {
            this.highScoreText.text = this.scoreText.text;
            AAHighScores.saveScoreToLocalStorage(thescore);
        }
    };
    MenuOverlay.prototype.visitSponsor = function () {
        if (kUSESPONSOR) {
            // AAKaiAnalytics.sendSponsorEvent();
            // let txt = this.cache.text.get('sponsorURL');
            // // console.log(txt);
            // //window.location.href = txt;
            // window.open(
            //     txt,
            //     '_blank' //open in a new window.
            // );
            AAKaiAds.theBannerAd.call('click');
        }
    };
    MenuOverlay.prototype.createPauseGrc = function () {
        var graphics = this.add.graphics();
        graphics.beginPath();
        graphics.moveTo(0, 160);
        graphics.lineTo(this.sys.canvas.width, 160);
        graphics.lineTo(this.sys.canvas.width, 240);
        graphics.lineTo(0, 240);
        graphics.closePath();
        graphics.strokePath();
        graphics.fillStyle(0xff0000, .75);
        graphics.fill();
        // =======================================================
        var graphics2 = this.add.graphics();
        var startx = this.sys.canvas.width / 2 - 30;
        var starty = 170;
        var pHeight = 60;
        graphics2.moveTo(startx, starty);
        graphics2.lineTo(startx + 20, starty);
        graphics2.lineTo(startx + 20, starty + pHeight);
        graphics2.lineTo(startx, starty + pHeight);
        graphics2.closePath();
        graphics2.strokePath();
        graphics2.fillStyle(0xFFFFFF, 1);
        graphics2.fill();
        // =======================================================
        var graphics3 = this.add.graphics();
        startx = this.sys.canvas.width / 2 + 10;
        graphics3.moveTo(startx, starty);
        graphics3.lineTo(startx + 20, starty);
        graphics3.lineTo(startx + 20, starty + pHeight);
        graphics3.lineTo(startx, starty + pHeight);
        graphics3.closePath();
        graphics3.strokePath();
        graphics3.fillStyle(0xFFFFFF, 1);
        graphics3.fill();
        this.pauseImage = this.add.container(0, 0, [graphics, graphics2, graphics3]).setVisible(false);
    };
    MenuOverlay.prototype.disablePause = function () {
        this.pauseEnabled = false;
        this.btnPause.setVisible(false);
    };
    MenuOverlay.prototype.hideTopPlaySoundButtons = function (_y) {
        this.showButton(this.c_btnSound, _y, this.c_btnSound.x);
        this.showButton(this.c_btnPlay, _y, this.c_btnPlay.x);
    };
    MenuOverlay.prototype.hideTopRowOfButtons = function (_y) {
        this.showButton(this.c_btnSettings, _y, this.c_btnSettings.x);
        this.showButton(this.c_btnMoreGames, _y, this.c_btnMoreGames.x);
        this.showButton(this.c_btnFullScreen, _y, this.c_btnFullScreen.x);
    };
    // **************************************************************************
    // **************************************************************************
    // **************************************************************************
    // Button CALLBACKS
    // **************************************************************************
    MenuOverlay.prototype.action_BtnPlay = function (state) {
        if (this.areButtonsTweening()) {
            return;
        }
        if (state == 'up') {
            this.playBtnSnd();
            switch (gGameState) {
                case states.kSTATE_PAUSED:
                    this.resetFromGame();
                    break;
                case states.kSTATE_GAMEOVER:
                    this.reset();
                    break;
                case states.kSTATE_HELP:
                    this.resetFromHelpBackButton("HelpScene");
                    break;
                case states.kSTATE_MENU:
                    this.reset();
                    break;
                default:
                    this.reset();
                    break;
            }
        }
    };
    MenuOverlay.prototype.action_btnSound = function (_state) {
        if (this.areButtonsTweening()) {
            return;
        }
        if (_state == 'up') {
            this.playBtnSnd();
            AAPrefs.toggleAudio();
            if (AAPrefs.playAudio == true) {
                // If we playAudio we flip the frame of the button to show the ON state when up and the OFF state when pressed         
                this.btnSound.setFrames('btnSoundOn.png', 'btnSoundOff.png', 'btnSoundOn.png');
                AAKaiAnalytics.sendEvent("soundOn");
            }
            else {
                // This will display the the OFF state when up and the ON state when pressed
                this.btnSound.setFrames('btnSoundOff.png', 'btnSoundOn.png', 'btnSoundOff.png'); //, 'btn_sound_off.png');
                AAKaiAnalytics.sendEvent("soundOff");
            }
            AAFunctions.tweenBounce(this, this.c_btnSound);
        }
    };
    MenuOverlay.prototype.action_btnPause = function (_state) {
        if (this.areButtonsTweening()) {
            return;
        }
        if (_state == 'up') {
            this.playBtnSnd();
            if (gGameState == states.kSTATE_PLAYING) {
                this.btnHelp.setTexture('spriteAtlas', 'btnBack.png');
                gGameState = states.kSTATE_PAUSED;
                this.showButton(this.c_btnHelp, this.buttonY, this.c_btnHelp.x);
                this.showButton(this.c_btnSound, this.buttonY, this.c_btnSound.x);
                this.pauseImage.setVisible(true);
                AAFunctions.tweenBounce(this, this.pauseImage);
                this.scene.get("SponsorOverlay").showBanner();
                game.scene.pause("GameScene");
                AAKaiAnalytics.sendEvent("pause");
            }
            else if (gGameState == states.kSTATE_PAUSED) {
                gGameState = states.kSTATE_PLAYING;
                this.showButton(this.c_btnHelp, this.buttonY + this.kHideDistance, this.c_btnHelp.x);
                this.showButton(this.c_btnSound, this.buttonY + this.kHideDistance, this.c_btnSound.x);
                this.pauseImage.setVisible(false);
                this.scene.get("SponsorOverlay").hideBanner();
                game.scene.resume("GameScene");
                AAKaiAnalytics.sendEvent("resume");
            }
        }
    };
    MenuOverlay.prototype.action_BtnHelpBack = function (_state) {
        if (this.areButtonsTweening()) {
            return;
        }
        if (_state == 'up') {
            this.playBtnSnd();
            // Just make sure that the gameover sprite is hidden in case this is called from a gameover()
            //  It's just easier this way.
            this.gameoverSprite.setVisible(false);
            switch (gGameState) {
                case states.kSTATE_MENU:
                    this.scene.get("MenuScene").scene.start("HelpScene");
                    gGameState = states.kSTATE_HELP;
                    this.hideTopPlaySoundButtons(this.buttonY + this.kHideDistance);
                    this.hideTopRowOfButtons(this.buttonY2 + this.kHideDistance);
                    this.btnHelp.setTexture('spriteAtlas', 'btnBack.png');
                    this.scene.get("SponsorOverlay").hideBanner();
                    AAFunctions.tweenBounce(this, this.c_btnHelp);
                    AAKaiAnalytics.sendEvent("help");
                    break;
                case states.kSTATE_GAMEOVER:
                    this.btnHelp.setTexture('spriteAtlas', 'btnHelp.png');
                    AAFunctions.tweenBounce(this, this.c_btnPlay);
                    AAFunctions.tweenBounce(this, this.c_btnHelp);
                    this.hideTopRowOfButtons(this.buttonY2);
                    this.scene.get("GameScene").scene.start("MenuScene");
                    gGameState = states.kSTATE_MENU;
                    AAKaiAnalytics.sendEvent("back-gameover");
                    break;
                case states.kSTATE_MOREGAMES:
                    this.resetFromHelpBackButton("MoreGamesScene");
                    break;
                case states.kSTATE_SETTINGS:
                    this.resetFromHelpBackButton("SettingsScene");
                    break;
                case states.kSTATE_PAUSED:
                case states.kSTATE_HELP:
                    this.action_BtnPlay("up");
                    break;
            }
            this.scene.bringToTop();
        }
    };
    MenuOverlay.prototype.action_btnFullscreen = function (_state) {
        if (kSHOW_FULLSCREEN_BUTTON) {
            if (gGameState == states.kSTATE_MENU) {
                if (_state == 'up') {
                    this.playBtnSnd();
                    if (this.scale.isFullscreen) {
                        this.btnFullscreen.setTexture('spriteAtlas', 'btnFullscreenOn.png');
                        this.scale.stopFullscreen();
                    }
                    else {
                        this.btnFullscreen.setTexture('spriteAtlas', 'btnFullscreenOff.png');
                        this.scale.startFullscreen();
                    }
                }
            }
        }
    };
    MenuOverlay.prototype.action_btnSettings = function (_state) {
        if (gGameState == states.kSTATE_MENU) {
            if (_state == 'up') {
                this.playBtnSnd();
                this.scene.get("MenuScene").scene.start("SettingsScene");
                gGameState = states.kSTATE_SETTINGS;
                this.hideTopPlaySoundButtons(this.buttonY + this.kHideDistance);
                this.hideTopRowOfButtons(this.buttonY2 + this.kHideDistance);
                this.btnHelp.setTexture('spriteAtlas', 'btnBack.png');
                this.scene.get("SponsorOverlay").hideBanner();
                AAFunctions.tweenBounce(this, this.c_btnHelp);
                AAKaiAnalytics.sendEvent("settings");
            }
        }
    };
    MenuOverlay.prototype.action_btnMoreGames = function (_state) {
        if (gGameState == states.kSTATE_MENU) {
            if (_state == 'up') {
                this.playBtnSnd();
                this.scene.get("MenuScene").scene.start("MoreGamesScene");
                gGameState = states.kSTATE_MOREGAMES;
                this.hideTopPlaySoundButtons(this.buttonY + this.kHideDistance);
                this.hideTopRowOfButtons(this.buttonY2 + this.kHideDistance);
                this.btnHelp.setTexture('spriteAtlas', 'btnBack.png');
                this.scene.get("SponsorOverlay").hideBanner();
                AAFunctions.tweenBounce(this, this.c_btnHelp);
                AAKaiAnalytics.sendEvent("moregames");
            }
        }
    };
    return MenuOverlay;
}(Phaser.Scene)); //end scene
var MenuScene = /** @class */ (function (_super) {
    __extends(MenuScene, _super);
    function MenuScene() {
        return _super.call(this, { key: 'MenuScene' }) || this;
    }
    MenuScene.prototype.preload = function () {
        this.cameras.main.setBackgroundColor(0x000000);
        gGameState = states.kSTATE_MENU;
    };
    MenuScene.prototype.create = function () {
        this.scene.sendToBack();
        this.add.text(12, this.sys.canvas.height - 17, gGameVersion);
    };
    return MenuScene;
}(Phaser.Scene));
var HelpScene = /** @class */ (function (_super) {
    __extends(HelpScene, _super);
    function HelpScene() {
        return _super.call(this, { key: 'HelpScene' }) || this;
    }
    HelpScene.prototype.preload = function () {
    };
    HelpScene.prototype.create = function () {
        gGameState = states.kSTATE_HELP;
        var mo = this.scene.get('MenuOverlay');
        mo.scoreText.setVisible(false);
        mo.highScoreText.setVisible(false);
        this.add.image(0, 0, 'spriteAtlas', 'help_en.png').setOrigin(0, 0);
    };
    return HelpScene;
}(Phaser.Scene));
var SponsorOverlay = /** @class */ (function (_super) {
    __extends(SponsorOverlay, _super);
    function SponsorOverlay() {
        var _this = _super.call(this, { key: 'SponsorOverlay' }) || this;
        _this.bottomPos = kBOTTOM_POSITION_FOR_AD;
        return _this;
    }
    SponsorOverlay.prototype.preload = function () {
    };
    SponsorOverlay.prototype.create = function () {
        if (kUSESPONSOR == false) {
            return;
        }
        this.events.removeListener('hideAd');
        this.events.removeListener('showAd');
        emitter.on('hideAd', this.hideBanner, this);
        emitter.on('showAd', this.showBanner, this);
        this.domad = document.getElementById('kaiosad');
        this.sponsorTag = document.getElementById('tag');
        ///////////////////////////////////////////////////
        var adFrame = this.add.image(0, 0, 'sponsor');
        adFrame.setOrigin(0, 0);
        // NOTE: 3/30/20
        // commented out the sponsor code to play with KaiAds
        // commented out setInteractive() and pointerUp
        this.btn = this.add.image(this.sys.canvas.width - 50, this.bottomPos, "spriteAtlas", "tag8.png").setVisible(false); //isKaiOS);
        this.adContainer = this.add.container(0, -this.bottomPos, [adFrame, this.btn]).setVisible(true).setVisible(false);
        ;
        // adFrame.setInteractive();
        // let xthis = this;
        // adFrame.on('pointerup', function (pointer) {
        //     (<MenuOverlay>xthis.scene.get("MenuOverlay")).visitSponsor();
        // });
        this.startyScore = this.scene.get("MenuOverlay").scoreText.y;
        this.startyHighScore = this.scene.get("MenuOverlay").highScoreText.y;
        // Sponsor Button #####################################################################
        this.btnSponsor = new Button(this, this.sys.canvas.width - 60, this.sys.canvas.height + 60, 'spriteAtlas', "sponsor.png", this.action_sponsorButton, "sponsor", true).setVisible(true).setOrigin(.5, 1).setVisible(isKaiOS);
        // this.showBanner();
    };
    SponsorOverlay.prototype.hideBanner = function () {
        // this.adContainer.setVisible(false);
        if (kUSESPONSOR == false) {
            return;
        }
        //works
        //this.domad.style.visibility = "hidden";
        this.tweens.add({
            targets: [this.adContainer, this.btn],
            y: -110,
            ease: 'Sine.easeIn',
            onUpdate: function () {
                this.domad.style.top = this.adContainer.y + "px";
            },
            callbackScope: this,
            duration: 250
        });
        this.tweens.add({
            targets: this.scene.get("MenuOverlay").scoreText,
            y: this.startyScore,
            ease: 'Sine.easeIn',
            duration: 250
        });
        this.tweens.add({
            targets: this.btnSponsor,
            y: this.sys.game.canvas.height + 80,
            ease: 'Sine.easeIn',
            duration: 250
        });
        gTween = this.tweens.add({
            targets: this.scene.get("MenuOverlay").highScoreText,
            y: this.startyHighScore,
            ease: 'Sine.easeIn',
            duration: 250
        });
    };
    SponsorOverlay.prototype.showBanner = function () {
        //works
        //this.domad.style.visibility = "visible";
        // if (gAdShowingBanner) {
        //     if (isKaiOS) {
        //         this.sponsorTag.style.visibility = "visible";
        //     }
        // } else {
        //     return;
        // }
        if (gGameState == states.kSTATE_PLAYING) {
            return;
        }
        if (kUSESPONSOR == false) {
            return;
        }
        // this.adContainer.setVisible(true);
        this.tweens.add({
            targets: this.adContainer,
            y: 0,
            ease: 'Sine.easeOut',
            onUpdate: function () {
                this.domad.style.top = this.adContainer.y + "px";
            },
            callbackScope: this,
            duration: 500
        });
        this.tweens.add({
            targets: this.btn,
            y: this.bottomPos,
            ease: 'Sine.easeOut',
            duration: 500
        });
        this.tweens.add({
            targets: this.scene.get("MenuOverlay").scoreText,
            y: this.startyScore + this.bottomPos,
            ease: 'Sine.easeOut',
            duration: 500
        });
        this.tweens.add({
            targets: this.btnSponsor,
            y: this.sys.game.canvas.height,
            ease: 'Sine.easeOut',
            duration: 250
        });
        gTween = this.tweens.add({
            targets: this.scene.get("MenuOverlay").highScoreText,
            y: this.startyHighScore + this.bottomPos,
            ease: 'Sine.easeOut',
            duration: 500
        });
    };
    SponsorOverlay.prototype.action_sponsorButton = function (_state) {
        if (_state == 'up') {
            if (!gAdShowing) {
                //this.playBtnSnd();
                AAKaiAds.theBannerAd.call('click');
            }
        }
    };
    return SponsorOverlay;
}(Phaser.Scene));
var GameScene = /** @class */ (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        var _this = _super.call(this, { key: 'GameScene' }) || this;
        _this.jumps = 0; //track ad launch
        _this.poop = 0;
        return _this;
    }
    GameScene.prototype.preload = function () {
    };
    GameScene.prototype.create = function () {
        // Launch the menu scene
        //this.scene.launch("MenuOverlay");
        // this.setUpSprites();
        // this.setUpPhysics(); //if needed
        // The game starts in menu mode
        // gGameState = gGameState = states.kSTATE_MENU;
        // this.removeAllListeners();
        // this.events.on('startgame', this.startGame, this);
        this.scene.bringToTop("MenuOverlay");
        this.startGame();
        AAKaiAds.preLoadDisplayAd();
    };
    // removeAllListeners() {
    //     this.events.removeListener('startgame');
    // }
    // This gets called from the menu scene when the play button is clicked
    // Init all my game data here.
    GameScene.prototype.startGame = function () {
        //I have to kill the KaiAd object because it causes stutter.
        gGameState = states.kSTATE_PLAYING;
        this.poop = 0;
        // this.add.image(this.sys.canvas.width/2,this.sys.canvas.height/2,"spriteAtlas","btnPause.png")
    };
    GameScene.prototype.update = function (time, delta) {
        switch (gGameState) {
            case states.kSTATE_PLAYING:
                this.poop = this.poop + 10;
                this.scene.get('MenuOverlay').events.emit('setscore', [this.poop]);
                if (this.poop >= 1545) {
                    gGameState = states.kSTATE_GAMEOVER;
                    this.gameover();
                }
                break;
        }
    };
    GameScene.prototype.gameover = function () {
        AAKaiAnalytics.sendEvent("gameover");
        gGameState = states.kSTATE_GAMEOVER;
        // show the game over button layout.
        this.scene.get('MenuOverlay').events.emit('gameover');
        // if (AAPrefs.playAudio == true)
        //     this.sfxEndGame.play();
        window.navigator.vibrate(300);
        this.cameras.main.shake(150);
        if (++this.jumps % 3 == 0) {
            // Display Fullscreen!
            AAKaiAds.displayFullscreenAd();
            AAKaiAds.preLoadDisplayAd();
        }
    };
    GameScene.prototype.setUpSprites = function () {
    };
    GameScene.prototype.setUpAudio = function () {
    };
    GameScene.prototype.setUpUI = function () {
    };
    return GameScene;
}(Phaser.Scene));
var kBOTTOM_POSITION_FOR_AD = 110;
var AAFunctions;
(function (AAFunctions) {
    // High Score Variables ===========================================================
    // ================================================================================
    // let highScoreObject = { player: "empty", score: 0 };
    // let highScoreList = [];
    // let maxHighScoreCount = 5;
    var bouncing = false;
    function logEvent(theEvent) {
        var textData = 'logEvent:' + theEvent;
        window.webkit.messageHandlers.observe.postMessage(textData);
    }
    AAFunctions.logEvent = logEvent;
    function fade(theScene, dir, length, callback, delayTime) {
        if (delayTime === void 0) { delayTime = 0; }
        var fadeRect;
        fadeRect = theScene.add.graphics();
        fadeRect.fillStyle(0x000000, 1);
        fadeRect.fillRect(0, 0, theScene.cameras.main.width, theScene.cameras.main.height);
        fadeRect.setDepth(9999);
        var fadeto = 1;
        fadeRect.alpha = 0;
        if (dir == 'in') {
            fadeto = 0;
            fadeRect.alpha = 1;
        }
        //delayTime = (delayTime == undefined) ? 0 : delayTime;
        theScene.tweens.add({
            targets: fadeRect,
            alpha: fadeto,
            duration: length,
            ease: 'Power.easeIn',
            delay: delayTime,
            onComplete: function (twn, targets, thisScene) {
                // targets[0].destroy();
                if (callback) {
                    theScene.time.delayedCall(250, function () { callback.call(theScene, callback); }, [], this);
                }
            }
        });
    }
    AAFunctions.fade = fade;
    function chanceRoll(chance) {
        if (chance === undefined) {
            chance = 50;
        }
        return chance > 0 && (Math.random() * 100 <= chance);
    }
    AAFunctions.chanceRoll = chanceRoll;
    function displayButtons(_buttons, _camera, _ypos, _spacer) {
        var spacer = _spacer;
        var totalButtonLength = _buttons.length; // + spacer;
        var stp = (_camera.width / _buttons.length); // + spacer;
        var startx = (stp / 2) - (spacer / 3);
        Phaser.Actions.GridAlign(_buttons, {
            width: totalButtonLength,
            height: 1,
            cellWidth: stp + _spacer / _buttons.length,
            // cellHeight: 50,
            x: startx,
            y: _ypos,
            position: Phaser.Display.Align.CENTER
        });
    }
    AAFunctions.displayButtons = displayButtons;
    var bounceTween;
    function areButtonsBouncing() {
        return bouncing;
        // if (this.bounceTween != null) {
        //     return this.bounceTween.isPlaying();
        // }
    }
    AAFunctions.areButtonsBouncing = areButtonsBouncing;
    function tweenBounce(theScene, who) {
        // if (this.game.device.desktop) {
        var scaleSpeed = 140;
        var scaleSize = 2.1;
        who.scaleX = scaleSize;
        who.scaleY = scaleSize;
        var xthis = this;
        this.bouncing = true;
        this.bounceTween = theScene.tweens.add({
            targets: who,
            scaleX: { value: 1, duration: 200, delay: 50 },
            scaleY: { value: 1, duration: 200 },
            ease: "Bounce.easeOut",
            onComplete: function () {
                xthis.bouncing = false;
            }
        });
    }
    AAFunctions.tweenBounce = tweenBounce;
})(AAFunctions || (AAFunctions = {})); //end class
var AAPrefs;
(function (AAPrefs) {
    var prefsPlayAudio;
    var prefsPlayMusic;
    AAPrefs.playAudio = false;
    AAPrefs.playMusic = false;
    function initGamePrefs(_gameName) {
        this.prefsPlayAudio = 'com.taaragames.' + _gameName + '.playAudio';
        this.prefsPlayMusic = 'com.taaragames.' + _gameName + '.playMusic';
        this.prefsHighScore = 'com.taaragames.' + _gameName + '.highScore';
        this.leaderboardFile = 'com.taaragames.' + _gameName + '.leaderboard5';
        this.gameName = _gameName;
        this.getAudioPref();
        this.getMusicPref();
    }
    AAPrefs.initGamePrefs = initGamePrefs;
    function getAudioPref() {
        // get the local saved info
        var scr = localStorage.getItem(this.prefsPlayAudio);
        // if it doens't exsist we assume true to start and save it for next time wee need to check
        if (scr == undefined) {
            localStorage.setItem(this.prefsPlayAudio, "1"); //save it
            this.playAudio = true; //set class variable
        }
        else {
            // If scr == 1 then set playAudio to true otherwise false
            this.playAudio = (scr.valueOf() == "1") ? true : false;
        }
    }
    AAPrefs.getAudioPref = getAudioPref;
    // This gets the currectly saved playAudio prefs
    function getMusicPref() {
        // get the local saved info
        var scr = localStorage.getItem(this.prefsPlayMusic);
        // if it doens't exsist we assume true to start and save it for next time wee need to check
        if (scr == undefined) {
            localStorage.setItem(this.prefsPlayMusic, "1"); //save it
            this.playMusic = true; //set class variable
        }
        else {
            // If scr == 1 then set playAudio to true otherwise false
            this.playMusic = (scr.valueOf() == "1") ? true : false;
        }
    }
    AAPrefs.getMusicPref = getMusicPref;
    function toggleAudio() {
        if (this.playAudio == true) {
            this.playAudio = false;
            localStorage.setItem(this.prefsPlayAudio, "0");
        }
        else {
            this.playAudio = true;
            localStorage.setItem(this.prefsPlayAudio, "1");
        }
    }
    AAPrefs.toggleAudio = toggleAudio;
})(AAPrefs || (AAPrefs = {}));
var aakaiads_ready = false;
var gAdShowing = false;
var gAdShowingBanner = false;
var AAKaiAds;
(function (AAKaiAds) {
    // display ad when app is loaded
    // the escape key will dismiss the ad on the PC 
    // on the device or simulator press left soft key
    var fullscreenAd = true; /* switch between fullscreen and responsive ad */
    //var testMode = 1; /* set to 0 for real ads */
    var theAd;
    var theAdDom;
    AAKaiAds.err = 0;
    function preLoadDisplayAd() {
        if (!isKaiOS || gRunnngInBrowser) {
            return;
        }
        var _this = this;
        // start off without an error
        this.err = 0;
        if (getKaiAd) {
            // display ad
            getKaiAd({
                publisher: '60580691-026e-426e-8dac-a3b92289a352',
                app: gGameName,
                test: kTESTMODE,
                timeout: 1000 * 120,
                /* error codes */
                /* https://www.kaiads.com/publishers/sdk.html#error */
                onerror: function (err) {
                    _this.err = err;
                    // (<any>window).firebase.analytics().logEvent("kaiAds", {
                    //     'hitType': 'event',
                    //     'error': err,
                    //     'game': gameName,
                    //     'version': gGameVersion
                    // });
                    // (<any>window).ga('send', 'event', gameName, 'kaiAds', "error", err, {
                    //     nonInteraction: true
                    // });
                    // AAKaiAnalytics.sendSpecial("kaiads", "error", err);
                    AAKaiAnalytics.sendSpecial("kaiads", "error");
                    console.warn('KaiAds error catch:', _this.err);
                },
                onready: function (ad) {
                    _this.theAd = ad;
                    //console.log("Add Ready:" + new Date().getTime())
                    ad.on('close', function () {
                        setTimeout(function () {
                            gAdShowing = false;
                        }, 500); /* delayed to avoid button click on current scene */
                        // show banner
                        document.getElementById('kaiosad').style.visibility = "visible";
                        if (isKaiOS) {
                            document.getElementById('tag').style.visibility = "visible";
                        }
                        AAKaiAnalytics.sendSpecial("kaiads", "close");
                    });
                    // Kept here for reference ------------------------------------
                    ad.on('click', function () {
                        // (<any>window).firebase.analytics().logEvent("kaiAds", {
                        //     'hitType': 'event',
                        //     'kaiAdEvent':"click",
                        //     'game': gameName,
                        //     'version': gGameVersion
                        // });
                        // (<any>window).ga('send', 'event', gameName, 'kaiAds', "click", {
                        //     nonInteraction: true
                        // });
                        AAKaiAnalytics.sendSpecial("kaiads", "click");
                    });
                    ad.on('display', function () {
                        // (<any>window).firebase.analytics().logEvent("kaiAds", {
                        //     'hitType': 'event',
                        //     'kaiAdEvent':"display",
                        //     'game': gameName,
                        //     'version': gGameVersion
                        // });
                        gAdShowing = true;
                        // (<any>window).ga('send', 'event', gameName, 'kaiAds', "display", {
                        //     nonInteraction: true
                        // });
                        document.getElementById('kaiosad').style.visibility = "hidden";
                        document.getElementById('tag').style.visibility = "hidden";
                        AAKaiAnalytics.sendSpecial("kaiads", "display");
                    });
                    // _this)
                }
            });
        }
    }
    AAKaiAds.preLoadDisplayAd = preLoadDisplayAd;
    function killAd() {
        this.theAd = null;
    }
    AAKaiAds.killAd = killAd;
    function getError() {
        if (!isKaiOS || gRunnngInBrowser) {
            return;
        }
        var error = 0;
        // If the add was never inited or unable to get called I have my own error code
        // Otherwise I return 0 or the error returned by the KaiAds sdk.
        if ((this.theAd == null) || (this.theAd == undefined)) {
            error = -1;
        }
        else {
            // errors are positive numbers in the sdk.  
            // so anything greater than zero is an error
            if (this.err > 0) {
                error = this.err;
            }
        }
        return error;
    }
    AAKaiAds.getError = getError;
    function clikcAd() {
        this.theAd.call('click');
    }
    AAKaiAds.clikcAd = clikcAd;
    function displayBannerAd() {
        //kaisponsor
    }
    AAKaiAds.displayBannerAd = displayBannerAd;
    function displayFullscreenAd() {
        if (!isKaiOS || gRunnngInBrowser) {
            return;
        }
        // If the ad isn't ready theAd will be undefinded 
        // so I need to check to make sure it's valid
        if (this.theAd) {
            if (this.err == 0) { // continue only if there isn't an error
                // gAdShowing = true;
                // AAKaiAnalytics.sendEvent("kaiAds_display","KaiAds");
                // (<any>window).firebase.analytics().logEvent("kaiAds_display_called", {
                //     'hitType': 'event',
                //     'game': gameName,
                //     'version': gGameVersion
                // });
                this.theAd.call('display');
            }
        }
    }
    AAKaiAds.displayFullscreenAd = displayFullscreenAd;
    // BANNER ADS
    function preLoadBannerAd() {
        var _this = this;
        // start off without an error
        this.err = 0;
        if (getKaiAd) {
            // display ad
            getKaiAd({
                publisher: '60580691-026e-426e-8dac-a3b92289a352',
                app: gGameName,
                test: kTESTMODE,
                timeout: 1000 * 120,
                h: 54,
                w: 216,
                container: document.getElementById('kaiosad'),
                /* error codes */
                /* https://www.kaiads.com/publishers/sdk.html#error */
                onerror: function (err) {
                    _this.err = err;
                    AAKaiAnalytics.sendSpecial("kaisponsor", "error");
                    console.warn('KaiAds error catch:', _this.err);
                    document.getElementById('tag').style.visibility = "hidden";
                    gAdShowingBanner = false;
                    emitter.emit('hideAd');
                },
                onready: function (ad) {
                    _this.theBannerAd = ad;
                    ad.call('display', {
                        // In KaiOS the app developer is responsible
                        // for user navigation, and can provide
                        // navigational className and/or a tabindex
                        tabindex: 0,
                        // if the application is using
                        // a classname to navigate
                        // this classname will be applied
                        // to the container
                        navClass: 'kaisponsor',
                        // display style will be applied
                        // to the container block or inline-block
                        display: 'block',
                    });
                    //console.log("Add Ready:" + new Date().getTime())
                    //    document.getElementById('kaiosad').style.top = "50px";
                    //    document.getElementById('gameStage').style.top = "-50px !important";
                    ad.on('close', function () {
                        AAKaiAnalytics.sendSpecial("kaiadsbanner", "close");
                    });
                    // Kept here for reference ------------------------------------
                    ad.on('click', function () {
                        AAKaiAnalytics.sendSpecial("kaiadsbanner", "click");
                    });
                    ad.on('display', function () {
                        gAdShowingBanner = true;
                        emitter.emit('showAd');
                        if (isKaiOS) {
                            document.getElementById('tag').style.visibility = "visible";
                        }
                        AAKaiAnalytics.sendSpecial("kaiadsbanner", "display");
                    });
                    // _this)
                }
            });
        }
    }
    AAKaiAds.preLoadBannerAd = preLoadBannerAd;
})(AAKaiAds || (AAKaiAds = {}));
// 1    Document body not yet ready	- Please invoke getKaiAd after the DOMContentLoaded event.
// 2	Ad onready function is required	- Please implement the onready function to handle the returned ad.
// 3	Ad container dimension is too small	- Try increasing the width/height parameters.
// 4	Ad iframe is gone - The ad iframe may have been acidentally removed.
// 5	Ad request timed out - Try another network or adjust the timeout parameter.
// 6	Server responded 'no ad' - The specified ad dimension may not available, try adjusting the width/height.
// 7	Frequency capping in effect	- Frequency capping is the limit on how often the device can request for an ad, please try again later.
// 8	Configuration error: Missing w & h - Please provide the width and height parameters for getKaiAd.
// 9	Bad server response	- Server error, please contact support.
// 10, 11, 12	Internal error - SDK internal error, please contact support.
// 13	Cannot process server response - Server error, please contact support.
// 14	No server response - Server error, please contact support.
// 15	Configuration error: Invalid test parameter - The test parameter should either be 1 or 0.
// 16	ad.call('display') is not allowed to be called more than once - An ad container should only be displaying ads once.
// 17	Cannot fetch settings
var AAKaiControls;
(function (AAKaiControls) {
    AAKaiControls.NumKey1 = 0;
    AAKaiControls.NumKey2 = 0;
    AAKaiControls.NumKey3 = 0;
    AAKaiControls.NumKey4 = 0;
    AAKaiControls.NumKey5 = 0;
    AAKaiControls.NumKey6 = 0;
    AAKaiControls.NumKey7 = 0;
    AAKaiControls.NumKey8 = 0;
    AAKaiControls.NumKey9 = 0;
    AAKaiControls.NumKey0 = 0;
    AAKaiControls.StarKey = 0;
    AAKaiControls.PoundKey = 0;
    AAKaiControls.Enter = 0;
    AAKaiControls.SoftLeft = 0;
    AAKaiControls.SoftRight = 0;
    AAKaiControls.ArrowUp = 0;
    AAKaiControls.ArrowDown = 0;
    AAKaiControls.ArrowLeft = 0;
    AAKaiControls.ArrowRight = 0;
    AAKaiControls.call = 0;
    AAKaiControls.backspace = 0;
    var onKeyDown;
    var onkeyup;
    var singlePress = 0;
    var inited = 0;
    var theScene;
    function setUpInputs(_scene) {
        this.inited = 1;
        var _this = this;
        document.addEventListener('keydown', function (event) {
            _this.handleKeyDown(event);
            emitter.emit('keydown', event);
        });
        document.addEventListener('keyup', function (event) {
            _this.handleKeyUp(event);
            emitter.emit('keyup', event);
        });
        this.spacebar = _scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // Leaving this here commented until I find out if it's usable or not.
        // window.addEventListener('mozbrowserbeforekeydown', function (event) {
        //     _this.handleKeyDown(event)
        //     emitter.emit('keydown', event);
        // });
        // window.addEventListener('mozbrowserbeforekeyup', function (event) {
        //     _this.handleKeyUp(event)
        //     emitter.emit('keyup', event);
        // });
        // window.addEventListener('mozbrowserafterkeydown', function () { }); // no use
        // window.addEventListener('mozbrowserafterkeyup', function () { }); // no use
    }
    AAKaiControls.setUpInputs = setUpInputs;
    function useTouchInput(_scene) {
        this.theScene = _scene;
        this.theScene.input.addPointer(5);
        this.theScene.input.on('pointerup', this.pointerUp, this);
        this.theScene.input.on('pointerdown', this.pointerDown, this);
    }
    AAKaiControls.useTouchInput = useTouchInput;
    function pointerUp(pointer) {
        if (pointer.id == 1) {
            this.Enter = 0;
        }
    }
    AAKaiControls.pointerUp = pointerUp;
    function pointerDown(pointer) {
        if (pointer.id == 1) {
            this.Enter = 1;
        }
    }
    AAKaiControls.pointerDown = pointerDown;
    function handleKeyDown(e) {
        switch (e.key) {
            case 'ArrowUp':
                this.ArrowUp = 1;
                break;
            case 'ArrowDown':
                this.ArrowDown = 1;
                break;
            case 'ArrowRight':
                this.ArrowRight = 1;
                break;
            case 'ArrowLeft':
                this.ArrowLeft = 1;
                break;
            case '1':
                this.NumKey1 = 1;
                break;
            case '2':
                this.NumKey2 = 1;
                break;
            case '3':
                this.NumKey3 = 1;
                break;
            case '4':
                this.NumKey4 = 1;
                break;
            case '5':
                this.NumKey5 = 1;
                break;
            case '6':
                this.NumKey6 = 1;
                break;
            case '7':
                this.NumKey7 = 1;
                break;
            case '8':
                this.NumKey8 = 1;
                break;
            case '9':
                this.NumKey9 = 1;
                break;
            case '0':
                this.NumKey0 = 1;
                break;
            case '*':
                this.StarKey = 1;
                break;
            case '#':
                this.PoundKey = 1;
                break;
            case 'SoftLeft':
            case '[':
                this.SoftLeft = 1;
                break;
            case 'SoftRight':
            case ']':
                this.SoftRight = 1;
                break;
            case 'Enter':
            case '=':
                this.Enter = 1;
                // e.preventDefault();
                break;
        }
        // e.preventDefault();
    }
    AAKaiControls.handleKeyDown = handleKeyDown;
    function handleKeyUp(e) {
        switch (e.key) {
            case 'ArrowUp':
                this.ArrowUp = 0;
                break;
            case 'ArrowDown':
                this.ArrowDown = 0;
                break;
            case 'ArrowRight':
                this.ArrowRight = 0;
                break;
            case 'ArrowLeft':
                this.ArrowLeft = 0;
                break;
            case '1':
                this.NumKey1 = 0;
                break;
            case '2':
                this.NumKey2 = 0;
                break;
            case '3':
                this.NumKey3 = 0;
                break;
            case '4':
                this.NumKey4 = 0;
                break;
            case '5':
                this.NumKey5 = 0;
                break;
            case '6':
                this.NumKey6 = 0;
                break;
            case '7':
                this.NumKey7 = 0;
                break;
            case '8':
                this.NumKey8 = 0;
                break;
            case '9':
                this.NumKey9 = 0;
                break;
            case '0':
                this.NumKey0 = 0;
                break;
            case '*':
                this.StarKey = 0;
                break;
            case '#':
                this.PoundKey = 0;
                break;
            case 'SoftLeft':
            case '[':
                this.SoftLeft = 0;
                break;
            case 'SoftRight':
            case ']':
                this.SoftRight = 0;
                break;
            case 'Enter':
            case '=':
                this.Enter = 0;
                //  e.preventDefault();
                break;
        }
        // e.preventDefault();
    }
    AAKaiControls.handleKeyUp = handleKeyUp;
    function deSeclectAllButtons(theList) {
        for (var i = 0; i < theList.length; i++) {
            theList[i].deselect();
        }
    }
    AAKaiControls.deSeclectAllButtons = deSeclectAllButtons;
})(AAKaiControls || (AAKaiControls = {}));
var AAHighScores;
(function (AAHighScores) {
    // High Score Variables ===========================================================
    // ================================================================================
    AAHighScores.highScoreObject = { player: "empty", score: 0 };
    AAHighScores.highScoreList = [];
    AAHighScores.maxHighScoreCount = 5;
    function initHighScores() {
        this.highScoreList = [];
        this.checkForHighScoreList();
        this.getScoreFromLocalStorage();
    }
    AAHighScores.initHighScores = initHighScores;
    function checkForHighScoreList() {
        var scr = localStorage.getItem(AAPrefs.leaderboardFile);
        if (scr == undefined) {
            this.createDummyHighScores();
        }
    }
    AAHighScores.checkForHighScoreList = checkForHighScoreList;
    function createDummyHighScores() {
        this.saveHighScoreToLeaderboard("Mark", Phaser.Math.RND.integerInRange(1, 10), true);
        this.saveHighScoreToLeaderboard("Lori", Phaser.Math.RND.integerInRange(1, 10), true);
        this.saveHighScoreToLeaderboard("Reese", Phaser.Math.RND.integerInRange(1, 10), true);
        this.saveHighScoreToLeaderboard("Sophia", Phaser.Math.RND.integerInRange(1, 10), true);
        this.saveHighScoreToLeaderboard("Loki", Phaser.Math.RND.integerInRange(1, 10), true);
        this.getHighScoreList();
    }
    AAHighScores.createDummyHighScores = createDummyHighScores;
    function saveHighScoreToLeaderboard(theName, theScoreToSave, save) {
        //add the highscore and name to the array
        var newScoreObj = { player: theName, score: theScoreToSave };
        this.highScoreList.push(newScoreObj);
        var byScore = this.highScoreList.sort(AAHighScores.compareDESC);
        // remove the last element in the array
        // since i only want 10 items
        if (byScore.length > this.maxHighScoreCount) {
            byScore.pop(); //slice(byScore.length);
        }
        if (save == true) {
            localStorage.setItem(AAPrefs.leaderboardFile, JSON.stringify(this.highScoreList));
        }
    }
    AAHighScores.saveHighScoreToLeaderboard = saveHighScoreToLeaderboard;
    //Sort low to high -> 1,2,3,4,5,6,7,8,9,10
    function compareASC(scoreA, scoreB) {
        return parseFloat(scoreA.score) - parseFloat(scoreB.score);
    }
    AAHighScores.compareASC = compareASC;
    //sort high to low -> 10,9,8,7,6,5,4,3,2,1
    function compareDESC(scoreA, scoreB) {
        return parseFloat(scoreB.score) - parseFloat(scoreA.score);
    }
    AAHighScores.compareDESC = compareDESC;
    function postScoreToGameCenter(theScoreToSave) {
        var textData = 'saveHighScore:' + theScoreToSave.toString();
        window.webkit.messageHandlers.observe.postMessage(textData);
    }
    AAHighScores.postScoreToGameCenter = postScoreToGameCenter;
    function openGameCenter() {
        window.webkit.messageHandlers.observe.postMessage('showGameCenter:0');
    }
    AAHighScores.openGameCenter = openGameCenter;
    function getScoreFromLocalStorage() {
        var scr = localStorage.getItem(AAPrefs.prefsHighScore);
        if (scr == undefined) {
            localStorage.setItem(AAPrefs.prefsHighScore, "0");
            this.highScore = 0;
        }
        else {
            this.highScore = parseInt(scr);
        }
        return this.highScore;
    }
    AAHighScores.getScoreFromLocalStorage = getScoreFromLocalStorage;
    function saveScoreToLocalStorage(theScoreToSave) {
        if (theScoreToSave >= this.highScore) {
            this.highScore = theScoreToSave;
            localStorage.setItem(AAPrefs.prefsHighScore, theScoreToSave.toString());
        }
        return this.highScore;
    }
    AAHighScores.saveScoreToLocalStorage = saveScoreToLocalStorage;
    function checkIfMadeItIntoHighscoreList(theNewScore) {
        var isGoodEnough = false;
        if (theNewScore == 0) {
            return false;
        }
        //Double check I loaded the highscore list
        if (this.highScoreList.length <= 0) {
            this.getHighScoreList();
        }
        // See if the score table is still less than maxHighScoreCount
        if (this.highScoreList.length < this.maxHighScoreCount) {
            isGoodEnough = true;
        }
        for (var i = 0; i < this.highScoreList.length; i++) {
            var oldScore = this.highScoreList[i].score;
            if (theNewScore >= oldScore) {
                isGoodEnough = true;
                break;
            }
        }
        return isGoodEnough;
    }
    AAHighScores.checkIfMadeItIntoHighscoreList = checkIfMadeItIntoHighscoreList;
    function getHighScoreList() {
        //console.log("getHighScore()")
        var scr = localStorage.getItem(AAPrefs.leaderboardFile);
        if (scr == undefined) {
            for (var i = 0; i < this.maxHighScoreCount; i++) {
                this.highScoreList[i] = this.highScoreObject;
            }
            localStorage.setItem(AAPrefs.leaderboardFile, JSON.stringify(this.highScoreList));
            // this.highScore = 0;
        }
        else {
            this.highScoreList = JSON.parse(scr);
        }
    }
    AAHighScores.getHighScoreList = getHighScoreList;
    function insertNameIntoHighScoreList(theName, theScoreToSave) {
        // public static getHighScoreList(theName, theScoreToSave) {
        var tempScoreList = this.highScoreList.slice(0);
        //add the higscore and name to the array
        var newScoreObj = { player: theName, score: theScoreToSave };
        tempScoreList.push(newScoreObj);
        var byScore = tempScoreList.sort(AAHighScores.compareDESC);
        // the last element in the array
        // since i only want maxHighScoreCount items
        if (byScore.length > AAHighScores.maxHighScoreCount) {
            byScore.pop(); //slice(byScore.length);
        }
        return tempScoreList;
    }
    AAHighScores.insertNameIntoHighScoreList = insertNameIntoHighScoreList;
})(AAHighScores || (AAHighScores = {}));
// Google analytics engine to anon track user engagment
//
// Events show up in real time.
// !IMPORTANT --> Events can take up to 48 hours to show up in the behaviors section
//
// This code was modified from definityTyped.org typscript repo
//
// It's best to create a new property per game.
//
var AAKaiAnalytics;
(function (AAKaiAnalytics) {
    AAKaiAnalytics.gaNewElem = {};
    AAKaiAnalytics.gaElems = {};
    AAKaiAnalytics.gameName = '';
    function getDeviceData() {
        var myOwnRegex = [[/(kaios)\/([\w\.]+)/i], [window.UAParser.BROWSER.NAME, window.UAParser.BROWSER.VERSION]];
        var parser = new window.UAParser({ browser: myOwnRegex });
        var vendor = parser.getDevice().vendor;
        var model = parser.getDevice().model;
        var os;
        os = parser.getBrowser();
        if (vendor == null) {
            vendor = 'unknown';
        }
        if (os == null) {
            os = 'unknown';
        }
        if (model == null) {
            model = 'unknown';
        }
        AAKaiAnalytics.sendEvent("startgame");
        if (gAnalytic == kFIREBASE) {
            if (isKaiOS) {
                window.firebase.analytics().logEvent(gGameName, {
                    'vendor': vendor,
                    "model": model,
                    'version': gGameVersion,
                });
                window.firebase.analytics().logEvent(gGameName, {
                    'KaiOS': os.version,
                    'version': gGameVersion,
                });
            }
        }
        else {
            AAKaiAnalytics.sendSpecial("vendor", vendor + " " + model);
            AAKaiAnalytics.sendSpecial("KaiOS", os.version);
        }
    }
    AAKaiAnalytics.getDeviceData = getDeviceData;
    function initAnalytics(googleID, _gameName) {
        this.gameName = _gameName;
        var currdate = new Date();
        (function (i, s, o, g, r, a, m) {
            i["GoogleAnalyticsObject"] = r;
            (i[r] =
                i[r] ||
                    function () {
                        (i[r].q = i[r].q || []).push(arguments);
                    }),
                (i[r].l = 1 * currdate);
            (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m);
        })(window, document, "script", "https://www.google-analytics.com/analytics.js", "ga", this.gaNewElem, this.gaElems);
        //NOTE: ga ERRORS are false possitives! Ignore
        window.ga("create", googleID, "auto");
        window.ga("send", "pageview");
        //AAKaiAnalytics.getDeviceData();
    }
    AAKaiAnalytics.initAnalytics = initAnalytics;
    function sendSpecial(_action, _label, _nointeract, _value) {
        if (_nointeract === void 0) { _nointeract = true; }
        if (_value === void 0) { _value = 0; }
        if (gAnalytic == kGOOGLE) {
            if (window.ga != undefined) {
                window.ga('send', {
                    // 'transport': 'beacon',
                    'hitType': 'event',
                    'eventCategory': gGameName,
                    'eventAction': _action,
                    'eventLabel': _label,
                    'eventValue': _value,
                    'nonInteraction': _nointeract
                });
            }
        }
        else if (gAnalytic == kMATOMO) {
            window._paq.push(['setRequestMethod', 'POST']);
            window._paq.push(['trackEvent', gGameName, _action, _label]);
        }
        else if (gAnalytic == kFIREBASE) {
            window.firebase.analytics().logEvent(_action, {
                'hitType': 'event',
                'game': gGameName,
                'version': gGameVersion,
                'label': _label,
                'value': _value
            });
        }
    }
    AAKaiAnalytics.sendSpecial = sendSpecial;
    // ga('send', 'event', [eventCategory], [eventAction], [eventLabel], [eventValue], [fieldsObject]);
    // sendEvent("play", gGameVersion);
    // sendEvent("os", '1.0.0',false);
    // export function sendEventGoogle(_action: String, _label: String, _nointeract = true, _value = 0) {
    function sendEvent(_action, _nointeract, _value) {
        if (_nointeract === void 0) { _nointeract = true; }
        if (_value === void 0) { _value = 0; }
        if (gAnalytic == kGOOGLE) {
            if (window.ga != undefined) {
                window.ga('send', {
                    // 'transport': 'beacon',
                    'hitType': 'event',
                    'eventCategory': gGameName,
                    'eventAction': _action,
                    'eventLabel': gGameVersion,
                    'eventValue': _value,
                    'nonInteraction': _nointeract
                });
            }
        }
        else if (gAnalytic == kMATOMO) {
            window._paq.push(['setRequestMethod', 'POST']);
            window._paq.push(['trackEvent', gGameName, _action, gGameVersion]);
        }
        else if (gAnalytic == kFIREBASE) {
            window.firebase.analytics().logEvent(gGameName, {
                'event': _action,
                'game': gGameName,
                'version': gGameVersion
            });
        }
    }
    AAKaiAnalytics.sendEvent = sendEvent;
    function sendSponsorEvent() {
        if (gAnalytic == kGOOGLE) {
            if (window.ga != undefined) {
                window.ga('send', {
                    // 'transport': 'beacon',
                    'hitType': 'event',
                    'eventCategory': "sponsorClick",
                    'eventAction': gGameName,
                    'eventLabel': "web",
                    'eventValue': 0,
                    'nonInteraction': false
                });
            }
        }
        else {
            window._paq.push(['setRequestMethod', 'POST']);
            window._paq.push(['trackEvent', "sponsorClick", gGameName, gGameVersion]);
        }
    }
    AAKaiAnalytics.sendSponsorEvent = sendSponsorEvent;
    // THIS IS LEFT HERE AS A REMINDER OF HOOW I LOADED A LOCAL VERIOSN OF ANALYTICS
    // export function initAnalyticsLocal(googleID, _gameName) {
    //   this.gameName = _gameName;
    //   var currdate: any = new Date();
    //   window['GoogleAnalyticsObject'] = 'ga';
    //   (<any>window).ga = (<any>window).ga || function () {
    //     (<any>window).ga.q = (<any>window).ga.q || [];
    //     (<any>window).ga.q.push(arguments);
    //   };
    //   (<any>window).ga.l = 1 * currdate;
    //   (<any>window).ga("create", googleID, "beacon");
    //   (<any>window).ga("send", "pageview");
    // }
})(AAKaiAnalytics || (AAKaiAnalytics = {})); //end module
/// <reference path="../../phaser.d.ts" />
/// <reference path='GameScene.ts'/>
/// <reference path='MenuScene.ts'/>
/// <reference path='MenuOverlay.ts'/>
/// <reference path='PreloadScene.ts'/>
/// <reference path='HelpScene.ts'/>
/// <reference path='MoreGamesScene.ts'/>
/// <reference path='SettingsScene.ts'/>
/// <reference path='Sponsor.ts'/>
/// <reference path='../../../AAShared/AAFunctions.ts'/>
/// <reference path='../../../AAShared/AAPrefs.ts'/>
/// <reference path='../../../AAShared/AAKaiAds.ts'/>
/// <reference path='../../../AAShared/AAKaiControls.ts'/>
/// <reference path='../../../AAShared/AAHighScores.ts'/>
/// <reference path='../../../AAShared/AAKaiAnalytics.ts'/>
var kTESTMODE = 1; /* set to 0 for real ads */
var gGameName = "_TEMPLATE_";
var gGameVersion = "1.0.0";
var gamePrefsFile = "_TEMPLATE_001";
var gameBGColor = 0x333333;
var gStageWidth = 240 * 2; // I'm leaving it as a multiple to remind me of org size
var gStageHeight = 320 * 2; //228 * 2; //web is 228
// Display length of Taara games Logo
var gLogoDisplayLength = 2000;
// SPONSOR
var gTween; //sponsor tween
var kUSESPONSOR = true;
var gIsKaiOSAppMode = (window.location.protocol == 'app:');
// Display certain buttons if needed.  There are only two that are shown or not
var kSHOW_SETTINGS_BUTTON = false;
var kSHOW_FULLSCREEN_BUTTON = !gIsKaiOSAppMode;
var isKaiOS = true;
if (navigator.userAgent.toLowerCase().indexOf('kaios') > -1) {
    isKaiOS = true;
}
// I need to check if I'm running in the built in browser or as an app
// Check for app: is easy but that's only if the app is packaged.  IF it's a hosted
// app then it looks the same as if you're in the browser.  THe ONLY difference
// I can find is the innerWidth height is shorter as at 228px.  But I have to check
// this height at start up before the user clikcs fullscreen.  If they do click
// fullscreen then with and height are 320x240 like normal. :/
var gRunnngInBrowser = false; //(window.innerHeight <= 228)
if (window.innerHeight <= 228) {
    gRunnngInBrowser = true;
}
var centerGame = Phaser.Scale.CENTER_HORIZONTALLY; //CENTER_BOTH;
var myScale;
if (gRunnngInBrowser) {
    // Phaser.Scale.CENTER_HORIZONTALLY;
    myScale = {
        parent: 'gameStage',
        // autoCenter: Phaser.Scale.CENTER_BOTH, //Phaser.Scale.CENTER_HORIZONTALLY,
        mode: Phaser.Scale.NONE,
        width: gStageWidth,
        height: gStageHeight
    };
}
else {
    myScale = {
        parent: 'gameStage',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.FIT,
        width: gStageWidth,
        height: gStageHeight
    };
}
var scenes = [BootScene, PreloadScene, MenuOverlay, SponsorOverlay, MenuScene, HelpScene, GameScene, MoreGamesScene, SettingsScene];
var states;
(function (states) {
    states[states["kSTATE_NOTHING"] = 0] = "kSTATE_NOTHING";
    states[states["kSTATE_START"] = 1] = "kSTATE_START";
    states[states["kSTATE_MENU"] = 2] = "kSTATE_MENU";
    states[states["kSTATE_HELP"] = 3] = "kSTATE_HELP";
    states[states["kSTATE_PLAYING"] = 4] = "kSTATE_PLAYING";
    states[states["kSTATE_LEVEL_ENDED"] = 5] = "kSTATE_LEVEL_ENDED";
    states[states["kSTATE_LEVEL_END_COUNTSCORE"] = 6] = "kSTATE_LEVEL_END_COUNTSCORE";
    states[states["kSTATE_LEVEL_END_COUNTBONUS"] = 7] = "kSTATE_LEVEL_END_COUNTBONUS";
    states[states["kSTATE_START_LEVEL_END_COUNTBONUS"] = 8] = "kSTATE_START_LEVEL_END_COUNTBONUS";
    states[states["kSTATE_LEVEL_END_COMPLETE"] = 9] = "kSTATE_LEVEL_END_COMPLETE";
    states[states["kSTATE_GAMEOVER_DELAY"] = 10] = "kSTATE_GAMEOVER_DELAY";
    states[states["kSTATE_GAMEOVER"] = 11] = "kSTATE_GAMEOVER";
    states[states["kSTATE_PAUSED"] = 12] = "kSTATE_PAUSED";
    states[states["kSTATE_SHOWING_AD"] = 13] = "kSTATE_SHOWING_AD";
    states[states["kSTATE_ADSELECTED"] = 14] = "kSTATE_ADSELECTED";
    states[states["kSTATE_MOREGAMES"] = 15] = "kSTATE_MOREGAMES";
    states[states["kSTATE_SETTINGS"] = 16] = "kSTATE_SETTINGS";
})(states || (states = {}));
var game;
var gGameState = states.kSTATE_NOTHING;
var emitter = new Phaser.Events.EventEmitter();
var kGOOGLE = 1;
var kMATOMO = 2;
var kFIREBASE = 3;
// gAnalytic is any one of the three above.  Future version will only have 
//kGOOGLE and maybe kFIREBASE if supported it next revision of kaios
var gAnalytic = 1;
// ******************************************************************************
// ******************************************************************************
// NOTE ******* 
//
// If using Matomo the init is in the index.html file 
// DON"T USE MATOMO FOR ONLINE GAMES. USE GOOGLE.
//
// Firebase does not work on KaiOS.  Period.
// 
// Using Google Analytics //////////////////////////////////////////////////////
// TEST:UA-150350318-3
// PROD:UA-150350318-1
// ******************************************************************************
AAKaiAnalytics.initAnalytics('UA-150350318-3', gGameName);
AAKaiAnalytics.getDeviceData();
function resize() {
    if (gRunnngInBrowser) {
        var game_ratio = 1; //(9 * 32) / (15 * 32);
        // Make div full height of browser and keep the ratio of game resolution
        var div = document.getElementById('gameStage');
        div.style.width = (window.innerHeight * game_ratio) + 'px';
        div.style.height = window.innerHeight + 'px';
        // Check if device DPI messes up the width-height-ratio
        var canvas = document.getElementsByTagName('canvas')[0];
        var dpi_w = (parseInt(div.style.width) / canvas.width);
        var dpi_h = (parseInt(div.style.height) / canvas.height);
        gStageHeight = window.innerHeight; // * (dpi_w / dpi_h);
        gStageWidth = window.innerWidth; // height* 0.6;
        game.canvas.style.width = gStageWidth + 'px';
        game.canvas.style.height = gStageHeight + 'px';
    }
}
window.onload = function () {
    var config = {
        type: Phaser.WEBGL,
        renderType: Phaser.WEBGL,
        scene: scenes,
        banner: false,
        title: gGameName,
        backgroundColor: gameBGColor,
        url: 'https://taaragames.com/',
        version: gGameVersion,
        autoFocus: true,
        autoRound: true,
        powerPreference: 'high-performance',
        dom: {
            createContainer: true
        },
        physics: {
            default: 'arcade',
            arcade: {
                debug: false,
                gravity: { x: 0, y: 0 }
            }
        },
        scale: myScale
        // scale: {
        //     parent: 'gameStage',
        //     // autoCenter: Phaser.Scale.CENTER_BOTH, //Phaser.Scale.CENTER_HORIZONTALLY,
        //     mode: Phaser.Scale.NONE, // we will resize the game with our own code (see Boot.js)
        //     width: gStageWidth,
        //     height: gStageHeight
        // },
    };
    game = new Phaser.Game(config);
    game.canvas.mozOpaque = true;
    window.addEventListener('resize', function (event) {
        resize();
    }, false);
    resize();
    document.addEventListener('fullscreenchange', function (event) {
        // document.fullscreenElement will point to the element that
        // is in fullscreen mode if there is one. If there isn't one,
        // the value of the property is null.
        if (document.fullscreenElement) {
            emitter.emit('fullscreen', [2.5]);
        }
        else {
            emitter.emit('fullscreen', [1]);
        }
    });
};
//# sourceMappingURL=game.js.map