## Include headers
!include MUI2.nsh

Page Custom SerialPageShow SerialPageLeave


## Displays the serial dialog
Function SerialPageShow

 !insertmacro MUI_HEADER_TEXT "Lisans Anahtarı" "Lütfen Lisans Anahtarınızı Giriniz"

 PassDialog::Dialog Serial            \
                    /HEADINGTEXT 'Lütfen aşağıdaki kutucuklara lisans anahtarınızı giriniz. Lisans anahtarı kurulumda size teslim edilmiş, ya da eposta olarak gönderilmiş olabilir.' \
                    /CENTER             \
                    /BOXDASH 12  70 4 '' \
                    /BOXDASH 92  70 4 ''  \
                    /BOXDASH 172 70 4 ''   \
                    /BOXDASH 252 70 4 ''    \
                    /BOX     332 70 4 ''

  Pop $R0 # success, back, cancel or error

FunctionEnd

## Validate serial numbers
Function SerialPageLeave

 ## Pop values from stack
 Pop $R0
 Pop $R1
 Pop $R2
 Pop $R3
 Pop $R4
 ## A bit of validation
 StrCmp $R1 '4242' +3
  MessageBox MB_OK|MB_ICONEXCLAMATION "Lisans anahtarınızı yanlış girdiniz. Lütfen tekrar deneyin."
  Abort
 ## Display the values
 MessageBox MB_OK|MB_ICONINFORMATION "Lisans anahtarınızı doğru girdiniz. Kurulumu devam edebilirsiniz"

FunctionEnd

