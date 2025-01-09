let battery = await Service.import('battery')
let audio = await Service.import('audio')
let network = await Service.import('network')
let hyprland = await Service.import('hyprland')

let showAudioPopup = Variable(false)
let showScreenSaver = Variable(false)

function arrayToColumn(array, spacing = 10, opaque = false, align = 'start') {
    return Widget.Box({
        spacing: spacing,
        vertical: true,
        children: array,
        className: opaque ? 'opaque' : '',
        vpack: align
    })
}

App.applyCss(`
    window {
        background-color: RGBA(40, 40, 40, 0);
        opacity: 0.65;
        border-radius: 999px;
    }

    button, .opaque {
        border-radius: 999px;
        background-color: rgb(57,57,57);
    }

    button:hover {
        background-color: rgb(69,69,69);
    }

    button:active {
        background-color: rgb(69,69,69);
    }

    button.active {
        background-color: #fff;
        color: #111;
    }
    
    .clock {
        font-size: 20px;
    }

    .evbx {
        border-radius: 999px;
        transition: background-color 200ms ease;  
    }

    .evbx:hover {
        background-color: RGBA(255, 255, 255, 0.3)
    }

    .lrpad {
        margin: 0px 30px;
    }

    .smallround {
        border-radius: 20px;
        background-color: RGBA(40, 40, 40, 0.01);
    }

    .blackout {
        border-radius: 0px;
        animation: screensaver 5s alternate infinite linear;
        color: #777;
    }

    @keyframes screensaver {
        from {
            background: #000;
        }
        
        to {
            background: #fff;
        }
    }
`)

App.config({
    windows: [
        Widget.Window({
            exclusivity: 'exclusive',
            margins: [5, 5],
            name: 'agsbar',
            anchor: ['top', 'left', 'bottom'],
            child: Widget.CenterBox({
                spacing: 8,
                vertical: true,
                startWidget: arrayToColumn([
                    Widget.Button({
                        child: Widget.Icon(
                            '/home/allan/Downloads/archlinux-symbolic.svg'
                        ),
                        onClicked: () =>
                            Utils.execAsync('bash /home/allan/start.sh')
                    }),
                    arrayToColumn(
                        [1, 2, 3, 4, 5].map(num => {
                            return Widget.Button({
                                child: Widget.Label(`${num}`),
                                className: hyprland
                                    .bind('active')
                                    .as(act =>
                                        act.workspace.id == num ? 'active' : ''
                                    ),
                                onClicked: () => {
                                    hyprland.messageAsync(
                                        `dispatch workspace ${num}`
                                    )
                                }
                            })
                        }),
                        0,
                        true
                    )
                ]),
                centerWidget: arrayToColumn(
                    [
                        Widget.Box({}),
                        Widget.Icon({
                            icon: battery.bind('icon-name')
                        }),
                        Widget.CircularProgress({
                            value: battery
                                .bind('percent')
                                .as(p => (p > 0 ? p / 100 : 0))
                        }),
                        Widget.EventBox({
                            child: arrayToColumn([
                                Widget.Icon().hook(audio.speaker, self => {
                                    const vol = audio.speaker.volume * 100
                                    const icon = [
                                        [101, 'overamplified'],
                                        [67, 'high'],
                                        [34, 'medium'],
                                        [1, 'low'],
                                        [0, 'muted']
                                    ].find(
                                        ([threshold]) => threshold <= vol
                                    )?.[1]

                                    self.icon = `audio-volume-${icon}-symbolic`
                                    self.tooltip_text = `Volume ${Math.floor(
                                        vol
                                    )}%`
                                }),
                                Widget.CircularProgress({
                                    value: audio.speaker.bind('volume')
                                })
                            ]),
                            className: 'evbx',
                            onPrimaryClick: () => showAudioPopup.setValue(true)
                        }),
                        Widget.Icon({
                            icon: network.wifi.bind('icon_name')
                        }),
                        Widget.CircularProgress({
                            value: network.wifi
                                .bind('strength')
                                .as(p => (p > 0 ? p / 100 : 0))
                        })
                    ],
                    10,
                    true
                ),
                endWidget: arrayToColumn(
                    [
                        Widget.Button({
                            child: Widget.Icon('system-shutdown'),
                            onClicked: () => showScreenSaver.setValue(true)
                        }),
                        Widget.Label({
                            className: 'clock',
                            justification: 'center'
                        }).poll(
                            2000,
                            label =>
                                (label.label = Utils.exec('date +"%I%n%M"'))
                        ),
                        Widget.Button({
                            child: Widget.Icon('system-shutdown'),
                            onClicked: () =>
                                Utils.execAsync('bash /home/allan/power.sh')
                        })
                    ],
                    10,
                    true,
                    'end'
                )
            })
        }),
        Widget.Window({
            name: 'agsbar-audiopopup',
            anchor: ['left'],
            exclusivity: 'ignore',
            layer: 'overlay',
            margins: [0, 0, 0, 50],
            visible: showAudioPopup.bind(),
            className: 'smallround',
            child: arrayToColumn([
                Widget.Slider({
                    hexpand: true,
                    drawValue: false,
                    onChange: ({ value }) => (audio.speaker.volume = value),
                    value: audio.speaker.bind('volume')
                }),
                Widget.Button({
                    child: Widget.Label('Ok'),
                    onClicked: () => showAudioPopup.setValue(false),
                    className: 'lrpad'
                })
            ])
        }),
        Widget.Window({
            name: 'agsbar-screensaver',
            anchor: ['right', 'top', 'bottom', 'left'],
            exclusivity: 'ignore',
            layer: 'overlay',
            margins: [0, 0, 0, 0],
            visible: showScreenSaver.bind(),
            className: 'blackout',
            child: Widget.EventBox({
                child: Widget.Label('Click anywhere to exit the screen saver.'),
                onPrimaryClick: () => showScreenSaver.setValue(false)
            })
        })
    ]
})
