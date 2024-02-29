use tauri::App;

/// setup
pub fn init(_app: &mut App) -> std::result::Result<(), Box<dyn std::error::Error>> {
    // let win = app.get_window("main").unwrap();

    // 鼠标穿透
    // win
    //     .set_ignore_cursor_events(true)
    //     .expect("error setting ignore cursor events");

    // 仅在 macOS 下执行
    // #[cfg(target_os = "macos")]

    // 仅在 windows 下执行
    // #[cfg(target_os = "windows")]

    Ok(())
}
