// src/core/src/main.rs
// Point d'entrée pour l'application backend Icare.

// Macro pour importer les fonctionnalités de Rocket
#[macro_use] extern crate rocket;

// Import des modules du projet.
// Assurez-vous que les noms des modules correspondent à vos fichiers.
pub mod aegis;
pub mod crypto;
pub mod dashboard;
pub mod neural_net;
pub mod neurofirewall;
pub mod warpshield;

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