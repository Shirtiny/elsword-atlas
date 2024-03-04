// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod setup;
use rdev::{EventType, Key};
// use std::time::Instant;
use tauri::Manager;
use tauri::Window;

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    // let start_time = Instant::now();
    // println!("\n经过了：{}毫秒", start_time.elapsed().as_millis());
    println!("input, {}! ", name);
    format!("input, {}! ", name)
}

fn get_key_name(key: Key) -> String {
    match key {
        Key::KeyZ => "z".into(),
        Key::KeyK => "k".into(),
        Key::KeyA => "a".into(),
        Key::KeyS => "s".into(),
        Key::KeyD => "d".into(),
        Key::KeyQ => "q".into(),
        Key::KeyW => "w".into(),
        Key::KeyE => "e".into(),
        Key::KeyR => "r".into(),
        Key::KeyF => "f".into(),
        Key::KeyX => "x".into(),
        Key::KeyC => "c".into(),
        Key::KeyH => "h".into(),
        Key::KeyI => "i".into(),
        Key::KeyO => "o".into(),
        Key::KeyV => "v".into(),
        Key::ControlLeft => "ctrlL".into(),
        _ => {
            format!("unknown")
        }
    }
}

#[tauri::command]
fn capture(window: Window) {
    print!("capture start");
    tauri::async_runtime::spawn(async move {
        rdev::grab(move |event| {
            let is_block: bool = match event.event_type {
                // EventType::KeyPress(button) => match button {
                //     Key::KeyZ => {
                //         greet("keydown-z");
                //         true
                //     }
                //     _ => false,
                // },
                EventType::KeyRelease(key) => match key {
                    _ => {
                        let _ = window.emit(
                            "keyup",
                            Payload {
                                message: get_key_name(key),
                            },
                        );
                        false
                    }
                },
                _ => false,
            };
            if is_block {
                None
            } else {
                Some(event)
            }
        })
        .unwrap();
    });
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .setup(setup::init)
        .invoke_handler(tauri::generate_handler![greet, capture])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
