# History

## 2.0.0 - 2016-Dec-26

### Upgrade electron to 1.4.13

## 1.3.1 - 2016-Apr-06

- Add underline keyboard shortcuts for Windows and Linux (#50)
- Add window min size 400px x 600px
- Prevent save window size for hidden windows
- Save state on window resize and move

## 1.3.0 - 2016-Apr-05

- Ask users to allow or deny when connecting to a server with invalid SSL
- HTTP Basic Authentication support (#144)
- Improve error handling for connecting to server (#143)
- OS X client - every word typed is highlighted as being misspelled (#162)
- Possibility to install without creating shortcut (#96)
- Restoring maximized window from tray restores to not maximized window size (#151)
- Save hidden state at Windows logout (#156)

## 1.2.0 - 2016-Mar-21

### Update electron-prebuilt to 0.36.10

- Add the "about" panel for windows and linux (#138)
- Add zoom options (#137)
- Application close (#123)
- Application crash when hiding or closing the app (#109)
- Do not add a big red dot on side bar for servers with unread messages (#132)
- Enable multilanguage spell checker; Allow user to set languages. (#124)
- Fix "Close Window" on OS X minimizes (#72)
- Improve spellchecker (#122)
- Improvements/huspell dicts (#128)
- Mac desktop client: Reload minimizes instead (#129)
- Open DevTools for active server (#136)
- Open DevTools for selected server instead of Electron (#133)
- Option to start the client hidden (#118)
- Prevent cache of server icon
- Reload current server instead of all application (#135)
- Right click reload server (#134)
- Spellchecker language not autodetecting on OS X (#119)
- Spellchecker not showing correct suggestions (#121)

## 1.1.0 - 2016-Feb-29

- Add server screen font not present on Windows (#100)
- Change Server Should be Add Server (#90)
- Close Now Closes the Application (#89)
- Have hotkeys to switch between Rocket chat instances. (#81)
- Make the taskbar blink when mentioned (#68)
- Open the app after installing on windows (#37)
- Option to change the install folder (#41)
- Right click -> copy / paste (#32)
- RIght click on URLs doesn't work cleanly in a cross-platform way. (#95)
- Start client with windows logon (#57)
- Tray icon on Windows requires triple click (#77)

> Special thanks to @floriangoeldi 

## 1.0.0 - 2016-Feb-19

### Update electron to v0.36.4

- Add files to make branding easily
- Add spellchecker
- Create class to manage servers
- Create class to manage sidebar (servers list)
- Create class to manage webviews
- If you inform a server address with HTTPS we will fallback to HTTP if necessary
- Improve file upload getting file from inside the web view instead of from the main view and transmit to the webview via IPC
- Improve offline message
- Load all servers on aplication startup to enable notifications for all servers
- Load the last server and last room on application load or refresh
- Move all images to /app/images
- Now you can inform the server address without protocol, we will try HTTPS and then HTTP
- Open correct server from desktop notification
- Reactive tray icon
- Remove coffee-script dependency
- Remove font Roboto
- Remove unused CSS/LESS
- Show total of unreads in the application icon (OS X)
- Sidebar design improvement
- Sidebar now have a new button to add new servers
- Sidebar shows server's alert badge
- Sidebar shows server's icon or initials
- Sidebar shows server's title on mouse over
- Sidebar shows server's unread count
- Use webviews to allow multiple servers online at the same time

## 0.10.0 - 2015-Nov-11

### Update Electron to 0.34.0

## 0.9.0 - 2015-Oct-23

- Option to hide server's list

## 0.8.0 - 2015-Sep-14

### Update Electron to 0.32.2

## 0.7.0 - 2015-Aug-26

- Now you can add multiple servers

## 0.6.0 - 2015-Aug-07

### Updated Electron to 0.31.0

-  New demo URL

## 0.5.0 - 2015-Jul-27

### Upgrade electron to 0.30.2

- Better error message
- Disabled _tray.setTitle(title); until it can be optional
- Fix crash when closing app from try in OS X
- Fixed oAuth logins
- Increase start window size
- Listen for double-clicked event on tray to minimize/restore window
- Move window to front when click to show in tray
- Open http links as external
- Remove unnecessary files from OSX and Windows release	
- Rename application executable and helpers
- Update Icons

## 0.4.0 - 2015-Jul-16

- Upgrade electron to 0.30.0 (Images from non HTTPS urls are displayed now)
- Improve icons for Windows
- Start using Coffee-Script

## 0.3.0 - 2015-Jul-15

- Tray icon
- Improve app icons

## 0.2.0 - 2015-Jul-10

- New app icon for OS X
- New background for dmg file
- Add application and context menus
