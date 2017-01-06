Name:     {{name}}
Version:  {{version}}
Release:  linux
Summary:  {{description}}
Group:    Applications/Communications
Vendor:   Rocket.Chat Community
Packager: {{author}}
License:  MIT
URL:      https://rocket.chat/
AutoReq:  0

%description
{{description}}

%install
mkdir -p %{buildroot}/opt/{{name}}
cp -r opt/{{name}}/* %{buildroot}/opt/{{name}}

mkdir -p %{buildroot}/usr/bin
cat > %{buildroot}/usr/bin/{{name}} <<EOF
#!/bin/bash
/opt/{{name}}/{{name}}
EOF

mkdir -p %{buildroot}/usr/share/applications
cp -r usr/share/applications/{{name}}.desktop \
    %{buildroot}/usr/share/applications

%files
%defattr(-,root,root,-)
/opt/{{name}}/
%attr(755,root,root) /usr/bin/{{name}}
/usr/share/applications/{{name}}.desktop
