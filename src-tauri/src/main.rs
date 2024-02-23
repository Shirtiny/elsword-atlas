// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use rdev::{EventType, Key};
// use std::time::Instant;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    // let start_time = Instant::now();
    // println!("\n经过了：{}毫秒", start_time.elapsed().as_millis());
    println!("input, {}! ", name);
    format!("input, {}! ", name)
}

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // emit the `event-name` event to all webview windows on the frontend
            app.emit_all(
                "event-name",
                Payload {
                    message: "Tauri is awesome!".into(),
                },
            )
            .unwrap();

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
                        EventType::KeyRelease(button) => match button {
                            Key::KeyZ => {
                                greet("keyup-z");
                                true
                            }
                            _ => false,
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

                format!("input,  ",)
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
