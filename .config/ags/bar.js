import {
    array_to_column,
    sound_icon,
    toggle_launcher,
    toggle_systray
} from './utils.js'

let hyprland = await Service.import('hyprland')
let audio = await Service.import('audio')
let network = await Service.import('network')
let battery = await Service.import('battery')

function start_button(launcher_open, systray_open) {
    return Widget.Button({
        child: Widget.Icon('/home/allan/.config/ags/start.svg'),
        on_clicked: () => {
            toggle_launcher(launcher_open, systray_open)
        },
        class_name: launcher_open.bind().as(open => (open ? 'active' : ''))
    })
}

function workspace_buttons() {
    return array_to_column(
        [1, 2, 3, 4, 5].map(num => {
            return Widget.Button({
                child: Widget.Label(`${num}`),
                class_name: hyprland
                    .bind('active')
                    .as(act => (act.workspace.id == num ? 'active' : '')),
                on_clicked: () => {
                    hyprland.messageAsync(`dispatch workspace ${num}`)
                }
            })
        }),
        0,
        true
    )
}

function systray_button(launcher_open, systray_open) {
    return Widget.Button({
        child: array_to_column([
            Widget.Label({
                className: 'clock',
                justification: 'center'
            }).poll(
                2000,
                label => (label.label = Utils.exec('date +"%I%n%M"'))
            ),
            Widget.Icon({
                icon: network.wifi.bind('icon_name')
            }),
            sound_icon(),
            Widget.Icon('system-shutdown')
        ]),
        class_name: systray_open.bind().as(open => (open ? 'active' : '')),
        on_clicked: () => {
            toggle_systray(launcher_open, systray_open)
        }
    })
}

export function bar(launcher_open, systray_open) {
    return Widget.Window({
        name: 'bar',
        anchor: ['top', 'left', 'bottom'],
        margins: [5, 0, 5, 5],
        exclusivity: 'exclusive',
        class_names: Utils.merge(
            [launcher_open.bind(), systray_open.bind()],
            (launcher_open, systray_open) => {
                return [
                    'bar',
                    launcher_open || systray_open
                        ? 'panel-open'
                        : 'panel-closed'
                ]
            }
        ),
        child: Widget.CenterBox({
            class_name: 'bar-centerbox',
            spacing: 0,
            vertical: true,
            start_widget: array_to_column([
                start_button(launcher_open, systray_open),
                workspace_buttons()
            ]),
            center_widget: Widget.Box({
                children: [
                    array_to_column([
                        sound_icon(),
                        Widget.ProgressBar({
                            vertical: true,
                            value: audio.speaker.bind('volume')
                        })
                    ]),
                    array_to_column([
                        Widget.Icon({
                            icon: battery.bind('icon_name')
                        }),
                        Widget.ProgressBar({
                            vertical: true,
                            value: battery.bind('percent').as(p => p / 100)
                        })
                    ])
                ],
                hpack: 'center'
            }),
            end_widget: array_to_column(
                [systray_button(launcher_open, systray_open)],
                10,
                true,
                'end'
            )
        })
    })
}
