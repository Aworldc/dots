import { background, bar } from './bar.js'
import { launcher, systray } from './sidepanels.js'
import { toggle_launcher, toggle_systray } from './utils.js'
import { frame, corner } from './frames.js'

let launcher_open = Variable(false)
let systray_open = Variable(false)

let do_toggle_launcher = () => toggle_launcher(launcher_open, systray_open)
let do_toggle_systray = () => toggle_systray(launcher_open, systray_open)

Utils.monitorFile(App.configDir, () => {
    App.resetCss()
    App.applyCss(`${App.configDir}/main.css`)
})

App.config({
    style: './main.css',
    windows: [
        background(),
        bar(launcher_open, systray_open),
        launcher(launcher_open, systray_open),
        systray(launcher_open, systray_open),
        frame('left'),
        frame('right'),
        frame('top'),
        frame('bottom'),
        corner('topleft'),
        corner('topright'),
        corner('bottomleft'),
        corner('bottomright')
    ]
})

export {
    do_toggle_launcher as toggle_launcher,
    do_toggle_systray as toggle_systray
}
