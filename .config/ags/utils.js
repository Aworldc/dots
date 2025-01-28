const audio = await Service.import('audio')

export function array_to_column(
    array,
    spacing = 10,
    opaque = false,
    align = 'start'
) {
    return Widget.Box({
        spacing: spacing,
        vertical: true,
        children: array,
        class_name: opaque ? 'opaque' : '',
        vpack: align
    })
}

export function array_to_row(array) {
    return Widget.Box({
        children: array
    })
}

export function sound_icon() {
    return Widget.Icon().hook(audio.speaker, self => {
        const vol = audio.speaker.volume * 100
        const icon = [
            [101, 'overamplified'],
            [67, 'high'],
            [34, 'medium'],
            [1, 'low'],
            [0, 'muted']
        ].find(([threshold]) => threshold <= vol)?.[1]

        self.icon = `audio-volume-${icon}-symbolic`
        self.tooltip_text = `Volume ${Math.floor(vol)}%`
    })
}

export function toggle_launcher(launcher_open, systray_open) {
    launcher_open.value = !launcher_open.value
    systray_open.value = false
}

export function toggle_systray(launcher_open, systray_open) {
    systray_open.value = !systray_open.value
    launcher_open.value = false
}
