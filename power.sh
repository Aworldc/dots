choice=$(echo -e "Power Off\nRestart\nLog out" | wofi -d -n -G --style "$HOME/.config/wofi/style.css" -k=/dev/null -p"Power menu" 2>&1 2>/dev/null)

if [[ "$choice" == "Power Off" ]]; then
    shutdown now
fi

if [[ "$choice" == "Restart" ]]; then
    shutdown -r now
fi

if [[ "$choice" == "Log out" ]]; then
    hyprctl dispatch exit
fi

