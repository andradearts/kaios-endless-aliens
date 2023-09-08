# KaiOS Game Template v3

## 09/07/23 Changes

**Github**  
https://github.com/andradearts/kaios-template-taara-phaser.git 

This is the final build of template except for bug fixes. I never plan on working on it again. It's now retired on on github for future purposes. Someday I'll make it public.

It's now in a state where I will update app-ads and bug fixes.

Everything should be included in the dev project.  Everything from art assets to code.  I removed all redundant files and backups.

**notes.txt**  
file has info on some CLI that I used.

**ADB CLI for my testing phones**  
adb -s YYNG190814000131 root && adb -s YYNG190814000131 forward tcp:6000 localfilesystem:/data/local/debugger-socket

To compile you'll need the AAShard repository and then make sure it's linked correctly in *config.ts*

## Tools
- [Affinity Designer](https://affinity.serif.com/en-us/designer/)
- [VS Code](https://code.visualstudio.com/)
- [Firebase](https://firebase.google.com/)
- [Phaser 3.60.0](https://phaser.io/)
- [Free Texture Packer](http://free-tex-packer.com/)

## 09/07/23 Changes

- updated kaiads sdk
- updated app-ads.txt
- updated manifests for v2 and v3
- update UI to final purple style
- cleaned up dev folder

## 2/14/23 Changes

- Removed all KaiOS touch code
- Rebuilt menuing code from ground up reducing code by 50%
- UI in now svg
- Score is now in the DOM
- removed redundant and unused code
- removed full screen option for web version
- move from TaaraGames repo this andradearts repo
