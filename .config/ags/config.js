import { bar } from './bar.js'
import { launcher, systray } from './sidepanels.js'

export let launcher_open = Variable(false)
export let systray_open = Variable(false)

Utils.monitorFile(App.configDir, () => {
    App.resetCss()
    App.applyCss(`${App.configDir}/main.css`)
})

App.config({
    style: './main.css',
    windows: [
        bar(launcher_open, systray_open),
        launcher(launcher_open, systray_open),
        systray(launcher_open, systray_open)
    ]
})
