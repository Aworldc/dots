import {
    array_to_column,
    sound_icon,
    array_to_row,
    toggle_launcher,
    toggle_systray
} from './utils.js'

let { query } = await Service.import('applications')
import brightness from './brightness.js'
let audio = await Service.import('audio')

function launcher_item(program, launcher_open, systray_open) {
    return Widget.Button({
        on_clicked: () => {
            toggle_launcher(launcher_open, systray_open)
            program.launch()
        },
        attribute: { program },
        child: Widget.Label({
            class_name: 'title',
            label: program.name,
            xalign: 0,
            vpack: 'center',
            truncate: 'end'
        })
    })
}

export function launcher(launcher_open, systray_open) {
    let programs = query('').map(x =>
        launcher_item(x, launcher_open, systray_open)
    )

    let program_list = Widget.Box({
        vertical: true,
        children: programs,
        spacing: 6
    })

    function reload() {
        programs = query('').map(x =>
            launcher_item(x, launcher_open, systray_open)
        )
        program_list.children = programs
    }

    let search_box = Widget.Entry({
        hexpand: true,
        css: `margin-bottom: 12px;`,
        on_accept: () => {
            const results = programs.filter(item => item.visible)
            if (results[0]) {
                toggle_launcher(launcher_open, systray_open)
                results[0].attribute.program.launch()
            }
        },

        on_change: ({ text }) =>
            programs.forEach(item => {
                item.visible = item.attribute.program.match(text ?? '')
            })
    })

    return Widget.Window({
        name: 'launcher',
        anchor: ['top', 'left', 'bottom'],
        exclusivity: 'ignore',
        class_names: ['sidepanel', 'launcher'],
        margins: [5, 5, 5, 59],
        visible: launcher_open.bind(),
        keymode: 'exclusive',
        child: Widget.Box({
            children: [
                Widget.Label({
                    label: 'Start Here',
                    class_name: 'sidepanel_title'
                }),
                search_box,
                Widget.Scrollable({
                    hscroll: 'never',
                    child: program_list,
                    vexpand: true
                })
            ],
            vexpand: true,
            spacing: 10,
            vertical: true
        }),
        setup: self => {
            self.keybind('Escape', () => {
                toggle_launcher(launcher_open, systray_open)
            })

            self.hook(launcher_open, () => {
                if (launcher_open.value == true) {
                    reload()
                    search_box.text = ''
                    search_box.grab_focus()
                }
            })
        }
    })
}

function power_buttons() {
    return [
        Widget.Button({
            child: Widget.Label('Power Off'),
            on_clicked: () => {
                Utils.exec('shutdown now')
            }
        }),
        Widget.Button({
            child: Widget.Label('Reboot'),
            on_clicked: () => {
                Utils.exec('reboot now')
            }
        }),
        Widget.Button({
            child: Widget.Label('Log Off'),
            on_clicked: () => {
                Utils.exec('pkill Hyprland')
            }
        })
    ]
}

export function systray(launcher_open, systray_open) {
    return Widget.Window({
        name: 'systray',
        anchor: ['top', 'left', 'bottom'],
        exclusivity: 'ignore',
        class_names: ['sidepanel', 'systray'],
        margins: [5, 5, 5, 59],
        keymode: 'exclusive',
        visible: systray_open.bind(),
        child: Widget.CenterBox({
            vertical: true,
            start_widget: array_to_column([
                Widget.Label({
                    class_name: 'sidepanel_title',
                    label: 'This System'
                }),
                Widget.Label({}).poll(
                    500,
                    label =>
                        (label.label = Utils.exec(
                            'date "+It is %A, %e of %B at%n%I:%M:%S"'
                        ))
                ),
                Widget.Calendar({
                    show_heading: false,
                    class_name: 'calendar'
                })
            ]),
            end_widget: array_to_column(
                [
                    array_to_row([
                        Widget.Icon('display-brightness-symbolic'),
                        Widget.Slider({
                            hexpand: true,
                            drawValue: false,
                            on_change: self =>
                                (brightness.screen_value = self.value),
                            value: brightness.bind('screen-value')
                        })
                    ]),
                    array_to_row([
                        sound_icon(),
                        Widget.Slider({
                            hexpand: true,
                            drawValue: false,
                            on_change: ({ value }) =>
                                (audio.speaker.volume = value),
                            value: audio.speaker.bind('volume')
                        })
                    ]),
                    ...power_buttons()
                ],
                6,
                false,
                'end'
            )
        }),
        setup: self => {
            self.keybind('Escape', () => {
                toggle_systray(launcher_open, systray_open)
            })
        }
    })
}
