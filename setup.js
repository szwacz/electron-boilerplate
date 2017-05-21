module.exports = {
    remove: [
        { file: 'resources/icons/512x512.png' },
        { file: 'resources/osx/dmg-background.png' },
        { file: 'resources/osx/dmg-background@2x.png' },
        { file: 'resources/osx/dmg-icon.icns' },
        { file: 'resources/osx/icon.icns' },
        { file: 'resources/windows/icon.ico' },
        { file: 'resources/windows/setup-icon.ico' },
        { folder: 'src/hello_world' },
        { file: 'setup.js' }
    ],
    clean: [
        {
            file: 'src/app.js',
            pattern: /(document|greet|\}\))/
        },
        {
            file: 'README.md',
            clear: true
        },
        {
            file: 'app/app.html',
            pattern: /(greet|subtitle|Welcome|environment|<\/p>)/
        }
    ],
    add: [
        { file: 'resources/icons/.gitkeep' },
        { file: 'resources/osx/.gitkeep' },
        { file: 'resources/windows/.gitkeep' }
    ]
};
