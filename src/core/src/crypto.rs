// Module Crypto pour les opérations cryptographiques
pub struct Crypto {
    algorithm: String,
}

impl Crypto {
    pub fn new() -> Self {
        Crypto {
            algorithm: "AES-256-GCM".to_string(),
        }
    }
} 