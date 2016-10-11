; NSIS packaging/install script
; Docs: http://nsis.sourceforge.net/Docs/Contents.html

; --------------------------------
;  Includes
; --------------------------------

!include LogicLib.nsh
!include nsDialogs.nsh
!include FileFunc.nsh
!insertmacro GetParameters

; --------------------------------
;  Variables
; --------------------------------

!define dest "{{dest}}"
!define src "{{src}}"
!define name "{{name}}"
!define productName "{{productName}}"
!define author "{{author}}"
!define version "{{version}}"
!define icon "{{icon}}"
!define setupIcon "{{setupIcon}}"
!define banner "{{banner}}"

!define exec "{{productName}}.exe"

!define regkey "Software\${productName}"
!define uninstkey "Software\Microsoft\Windows\CurrentVersion\Uninstall\${productName}"

!define uninstaller "uninstall.exe"

; --------------------------------
;  Installation
; --------------------------------

Unicode true
SetCompressor /SOLID lzma

Name "${productName}"
Icon "${setupIcon}"
OutFile "${dest}"
InstallDir "$PROGRAMFILES\${productName}"
InstallDirRegKey HKLM "${regkey}" ""

RequestExecutionLevel admin
CRCCheck on
SilentInstall normal

XPStyle on
ShowInstDetails nevershow
AutoCloseWindow false
WindowIcon off

Caption "${productName} Setup"
; Don't add sub-captions to title bar
SubCaption 3 " "
SubCaption 4 " "

;   --------------------------------
;    Page layout
;   --------------------------------

Page custom welcome
Page components
Page directory
Page instfiles
Page custom finish finishEnd

;   --------------------------------
;    Control variables
;   --------------------------------

Var Image
Var ImageHandle

Var LaunchAppCheckbox
Var LaunchAppCheckbox_State

;   --------------------------------
;    Installer init
;   --------------------------------

Function .onInit

    ;   --------------------------------
    ;    Checking previously installed version
    ;   --------------------------------

    ReadRegStr $R0 HKLM \
    "Software\Microsoft\Windows\CurrentVersion\Uninstall\${productName}" \
    "UninstallString"
    StrCmp $R0 "" done

    MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION \
    "${productName} is already installed. $\n$\nClick `OK` to remove the \
    previous version or `Cancel` to cancel this upgrade." \
    IDOK uninst
    Abort
    ;   --------------------------------
    ;    Run the uninstaller
    ;   --------------------------------
    uninst:
    ClearErrors
    ExecWait '$R0 _?=$INSTDIR' ;Do not copy the uninstaller to a temp file

    IfErrors no_remove_uninstaller done
      ;You can either use Delete /REBOOTOK in the uninstaller or add some code
      ;here to remove the uninstaller. Use a registry key to check
      ;whether the user has chosen to uninstall. If you are using an uninstaller
      ;components page, make sure all sections are uninstalled.
    no_remove_uninstaller:

    done:
    ;   --------------------------------
    ;    End of uninstaller
    ;   --------------------------------


    ; Set installer to silent if /silent switch was provided
    ${GetParameters} $R0
    ${GetOptionsS} $R0 "/silent" $0
    IfErrors +2 0
      SetSilent silent
    ClearErrors

    ; Extract banner image for welcome page
    InitPluginsDir
    ReserveFile "${banner}"
    File /oname=$PLUGINSDIR\banner.bmp "${banner}"

    ; Check if the application is currently running, show message if it is
    retryInstallation:
    FindWindow $0 "Chrome_WidgetWin_1" "${productName}"
        StrCmp $0 0 notRunning
            MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "${productName} is currently running. Please close the application to continue." /SD IDCANCEL IDRETRY retryInstallation
            Abort
    notRunning:

FunctionEnd

;   --------------------------------
;    Welcome page [custom]
;   --------------------------------

Function welcome

    nsDialogs::Create 1018

    ${NSD_CreateLabel} 185 1u 210 100% "Welcome to ${productName} version ${version} installer.$\r$\n$\r$\nClick next to continue."

    ${NSD_CreateBitmap} 0 0 170 210 ""
    Pop $Image
    ${NSD_SetImage} $Image $PLUGINSDIR\banner.bmp $ImageHandle

    nsDialogs::Show

    ${NSD_FreeImage} $ImageHandle

FunctionEnd

;   --------------------------------
;    Installation sections
;   --------------------------------

Section "${productName} Client"

    ; Make this section a requirement
    SectionIn RO

    WriteRegStr HKLM "${regkey}" "Install_Dir" "$INSTDIR"
    WriteRegStr HKLM "${uninstkey}" "DisplayName" "${productName}"
    WriteRegStr HKLM "${uninstkey}" "DisplayIcon" '"$INSTDIR\icon.ico"'
    WriteRegStr HKLM "${uninstkey}" "UninstallString" '"$INSTDIR\${uninstaller}"'
    WriteRegStr HKLM "${uninstkey}" "Publisher" "${author}"
    WriteRegStr HKLM "${uninstkey}" "DisplayVersion" "${version}"

    ; Remove all application files copied by previous installation
    RMDir /r "$INSTDIR"

    SetOutPath $INSTDIR

    ; Include all files from /build directory
    File /r "${src}\*"

    WriteUninstaller "${uninstaller}"

SectionEnd

Section "Desktop shortcut"

    ; Create desktop shortcut
    CreateShortCut "$DESKTOP\${productName}.lnk" "$INSTDIR\${exec}" "" "$INSTDIR\icon.ico"

SectionEnd

Section "Autostart Entry"

    ; Create autostart entry
    CreateShortCut "$SMSTARTUP\${productName}.lnk" "$INSTDIR\${exec}" "" "$INSTDIR\icon.ico"

SectionEnd

Section "Start Menu Entry"

    ; Create start menu entry
    SetShellVarContext all
    CreateShortCut "$SMPROGRAMS\${productName}.lnk" "$INSTDIR\${exec}" "" "$INSTDIR\icon.ico"

SectionEnd

;   --------------------------------
;    Finish page [custom]
;   --------------------------------

Function finish

    nsDialogs::Create 1018

    ${NSD_CreateLabel} 185 1u 210 30u "${productName} installation successfully finished."

    ${NSD_CreateCheckbox} 185 35u 100% 10u "Launch ${productName}"
    Pop $LaunchAppCheckbox
    ${NSD_SetState} $LaunchAppCheckbox ${BST_CHECKED}

    ${NSD_CreateBitmap} 0 0 170 210 ""
    Pop $Image
    ${NSD_SetImage} $Image $PLUGINSDIR\banner.bmp $ImageHandle

    nsDialogs::Show

    ${NSD_FreeImage} $ImageHandle

FunctionEnd

Function finishEnd
    ; Save checkbox state on installer leave
    ${NSD_GetState} $LaunchAppCheckbox $LaunchAppCheckbox_State

    ; Launch the app, if the box is checked
    ${If} $LaunchAppCheckbox_State == ${BST_CHECKED}
        Exec "$INSTDIR\${exec}"
    ${EndIf}
FunctionEnd

; --------------------------------
;  Uninstaller
; --------------------------------

ShowUninstDetails nevershow

UninstallCaption "Uninstall ${productName}"
UninstallText "Don't like ${productName} anymore? Hit uninstall button."
UninstallIcon "${icon}"

;   --------------------------------
;    Page layout
;   --------------------------------

UninstPage custom un.confirm un.confirmOnLeave
UninstPage instfiles

;   --------------------------------
;    Control variables
;   --------------------------------

Var RemoveAppDataCheckbox
Var RemoveAppDataCheckbox_State

;   --------------------------------
;    Uninstaller init
;   --------------------------------

Function un.onInit

    ; Check if the application is currently running, show message if it is
    retryUninstall:
    FindWindow $0 "Chrome_WidgetWin_1" "${productName}"
        StrCmp $0 0 notRunning
            MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "${productName} is currently running. Please close the application to continue." /SD IDCANCEL IDRETRY retryUninstall
            Abort
    notRunning:

FunctionEnd

;   --------------------------------
;    Confirm page [custom]
;   --------------------------------

Function un.confirm

    nsDialogs::Create 1018

    ${NSD_CreateLabel} 1u 1u 100% 24u "If you really want to remove ${productName} from your computer press uninstall button."

    ${NSD_CreateCheckbox} 1u 35u 100% 10u "Remove also my ${productName} personal data"
    Pop $RemoveAppDataCheckbox

    nsDialogs::Show

FunctionEnd

Function un.confirmOnLeave

    ; Save checkbox state on page leave
    ${NSD_GetState} $RemoveAppDataCheckbox $RemoveAppDataCheckbox_State

FunctionEnd

;   --------------------------------
;    Uninstallation sections
;   --------------------------------

Section "Uninstall"

    ; Remove registry entries
    DeleteRegKey HKLM "${uninstkey}"
    DeleteRegKey HKLM "${regkey}"

    ; Remove desktop shortcut
    Delete "$DESKTOP\${productName}.lnk"

    ; Remove autostart entry
    Delete "$SMSTARTUP\${productName}.lnk"

    ; Remove start menu entry
    SetShellVarContext all
    Delete "$SMPROGRAMS\${productName}.lnk"

    ; Remove whole directory from installation directory
    RMDir /r "$INSTDIR"

    ; Remove also appData directory generated by your app if user checked this option
    ${If} $RemoveAppDataCheckbox_State == ${BST_CHECKED}
        RMDir /r "$APPDATA\${productName}"
    ${EndIf}

SectionEnd
