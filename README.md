# Template Project for KaiOS apps
## KIAOS Phaser 3 Template

All Code is here for service workers and manifest file.

Using Phaser 3.18.1 until 3.19.0 is fixed

WHEN UPDATING PHASER YOU MUST CHANGE window.requestAnimationFrame TO window.mozRequestAnimationFrame
OTHERWISE IT'S 30fps


## Setup to Debugging on Nokia
Nokia debug code: *#*#33284#*#*

## Steps to get Firefox WebIDE to work.

If have latest firefox uninstall it.
Remove all Mozilla folders from /Users/{name]/AppData/Local LocalLow & Roaming.
Get Firefox 59
Install FF59 turn off wifi.
WHen done installing FF go to options and turn off Check for updates by setting it to NEVER!
Turn Wifi back on.

In terminal run this:
adb -s 1e564c11 root && adb -s 1e564c11 forward tcp:6000 localfilesystem:/data/local/debugger-socket
6000

-s is the serial of the device.  I needed this because I have multiple devices conntected and have a rouge emulator that I can't kill.

Open WebIDE and click Remote Runtime

It should say localhost:6000.  Click ok.

If all is well if should now be connected.  

Open a Packaged app and start testing.
# KaiOSWebGameTemplate240x240
