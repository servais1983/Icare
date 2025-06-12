// Module NeuralNet pour l'apprentissage automatique
pub struct NeuralNet {
    model_type: String,
}

impl NeuralNet {
    pub fn new() -> Self {
        NeuralNet {
            model_type: "deep_learning".to_string(),
        }
    }
} 