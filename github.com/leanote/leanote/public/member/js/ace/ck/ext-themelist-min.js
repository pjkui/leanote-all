ace.define("ace/ext/themelist",["require","exports","module","ace/lib/fixoldbrowsers"],function(r,e,o){r("ace/lib/fixoldbrowsers");var a=[["Chrome"],["Clouds"],["Crimson Editor"],["Dawn"],["Dreamweaver"],["Eclipse"],["GitHub"],["Solarized Light"],["TextMate"],["Tomorrow"],["XCode"],["Kuroir"],["KatzenMilch"],["Ambiance","ambiance","dark"],["Chaos","chaos","dark"],["Clouds Midnight","clouds_midnight","dark"],["Cobalt","cobalt","dark"],["idle Fingers","idle_fingers","dark"],["krTheme","kr_theme","dark"],["Merbivore","merbivore","dark"],["Merbivore Soft","merbivore_soft","dark"],["Mono Industrial","mono_industrial","dark"],["Monokai","monokai","dark"],["Pastel on dark","pastel_on_dark","dark"],["Solarized Dark","solarized_dark","dark"],["Terminal","terminal","dark"],["Tomorrow Night","tomorrow_night","dark"],["Tomorrow Night Blue","tomorrow_night_blue","dark"],["Tomorrow Night Bright","tomorrow_night_bright","dark"],["Tomorrow Night 80s","tomorrow_night_eighties","dark"],["Twilight","twilight","dark"],["Vibrant Ink","vibrant_ink","dark"]];e.themesByName={},e.themes=a.map(function(r){var o=r[1]||r[0].replace(/ /g,"_").toLowerCase(),a={caption:r[0],theme:"ace/theme/"+o,isDark:"dark"==r[2],name:o};return e.themesByName[o]=a,a})}),function(){ace.require(["ace/ext/themelist"],function(){})}();