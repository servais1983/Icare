// src/core/src/main.rs
// Point d'entrée pour l'application backend Icare.

// Macro pour importer les fonctionnalités de Rocket
#[macro_use] extern crate rocket;

// Import des modules du projet.
// Assurez-vous que les noms des modules correspondent à vos fichiers.
#[path = "../aegis/mod.rs"]
mod aegis;
#[path = "../crypto/mod.rs"]
mod crypto;
#[path = "../dashboard/mod.rs"]
mod dashboard;
#[path = "../neural_net/mod.rs"]
mod neural_net;
#[path = "../neurofirewall/mod.rs"]
mod neurofirewall;
#[path = "../warpshield/mod.rs"]
mod warpshield;

use std::fs;
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::thread;

// Route de base qui répond par "Hello, world!"
#[get("/")]
fn index() -> &'static str {
    "Hello from Icare Backend!"
}

// Fonction principale qui configure et lance le serveur Rocket.
#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![index])
        // Vous pouvez ajouter ici d'autres routes et configurations.
}

/// Gère une seule connexion client.
fn handle_client(mut stream: TcpStream) {
    let mut buffer = [0; 1024];
    match stream.read(&mut buffer) {
        Ok(size) => {
            // Ne traite que s'il y a quelque chose à lire
            if size > 0 {
                let request = String::from_utf8_lossy(&buffer[..]);
                println!("Requête reçue: {}", request);

                let response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\nHello from Icare Backend!\r\n";
                
                if let Err(e) = stream.write(response.as_bytes()) {
                    eprintln!("Échec de l'écriture dans le flux: {}", e);
                }
            }
        },
        Err(e) => {
            eprintln!("Échec de la lecture du flux: {}", e);
        }
    }
    if let Err(e) = stream.flush() {
        eprintln!("Échec du vidage du flux: {}", e);
    }
}

/// Point d'entrée principal de l'application backend.
fn main() {
    let listener = TcpListener::bind("0.0.0.0:8080").expect("Échec de la liaison au port 8080");
    println!("Serveur backend démarré sur 0.0.0.0:8080");

    // Accepte les connexions entrantes
    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                println!("Nouvelle connexion: {}", stream.peer_addr().unwrap());
                // Crée un nouveau thread pour chaque connexion
                thread::spawn(move || {
                    handle_client(stream);
                });
            }
            Err(e) => {
                eprintln!("Erreur: {}", e);
            }
        }
    }
} 