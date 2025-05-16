import { anchor_from_side } from './utils.js'

export let frame = side =>
    Widget.Window({
        name: `frame_${side}`,
        anchor: anchor_from_side(side),
        exclusivity: 'exclusive',
        class_names: ['frame', `frame-${side}`],
        margins: [0, 0, 0, 0],
        child: Widget.Icon({
            // Just a spacer
            icon: 'dialog-information-symbolic',
            size: 20 * (2 / 3),
            class_name: 'hidden'
        })
    })

let corner_to_anchor = corner => {
    if (corner == 'topleft') {
        return ['top', 'left']
    }

    if (corner == 'topright') {
        return ['top', 'right']
    }

    if (corner == 'bottomleft') {
        return ['bottom', 'left']
    }

    if (corner == 'bottomright') {
        return ['bottom', 'right']
    }
}

export let corner = corner =>
    Widget.Window({
        name: `corner_${corner}`,
        anchor: corner_to_anchor(corner),
        exclusivity: 'ignore',
        class_name: 'corner',
        margins: corner.includes('left') ? [0, 0, 0, 59] : [0, 0, 0, 0],
        child: Widget.Icon({
            icon: `/home/allan/.config/ags/corner-${corner}.svg`,
            size: 19 * (2 / 3)
        })
    })
