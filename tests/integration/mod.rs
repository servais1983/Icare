//! # Tests d'intégration pour le projet ICARUS
//! 
//! Ce module contient les tests d'intégration qui vérifient que les différents
//! modules du projet ICARUS fonctionnent correctement ensemble.

use std::sync::Arc;
use std::time::SystemTime;
use std::collections::HashMap;

// Import des modules principaux
#[path = "../../src/core/neural_net/mod.rs"]
mod neural_net;

#[path = "../../src/core/crypto/quantum_vault.rs"]
mod quantum_vault;

#[path = "../../src/core/aegis/mod.rs"]
mod aegis;

#[path = "../../src/core/dashboard/mod.rs"]
mod dashboard;

#[path = "../../src/core/warpshield/mod.rs"]
mod warpshield;

#[path = "../../src/core/neurofirewall/mod.rs"]
mod neurofirewall;

/// Test d'intégration entre NeuralNet et AEGIS
#[test]
fn test_neural_net_aegis_integration() {
    // Initialisation des modules
    let neural_net_config = neural_net::NeuralNetConfig::default();
    let neural_net = neural_net::NeuralNet::new(neural_net_config);
    
    let aegis_config = aegis::AegisConfig::default();
    let mut aegis = aegis::AegisOrchestrator::new(aegis_config);
    aegis.initialize().expect("Échec de l'initialisation d'AEGIS");
    
    // Création d'un événement de menace fictif
    let threat_event = aegis::ThreatEvent {
        id: String::from("threat-test-1"),
        threat_type: aegis::ThreatType::PortScan,
        severity: aegis::ThreatSeverity::Medium,
        confidence: 0.85,
        source: String::from("192.168.1.100"),
        target: String::from("192.168.1.1"),
        timestamp: SystemTime::now(),
        metadata: HashMap::new(),
    };
    
    // Traitement de l'événement par AEGIS
    let response_plan = aegis.process_threat_event(threat_event.clone())
        .expect("Échec du traitement de l'événement de menace");
    
    // Vérification des résultats
    assert_eq!(response_plan.threat_event.id, threat_event.id);
    assert!(response_plan.actions.contains(&aegis::ResponseAction::BlockIp));
    
    // Exécution du plan de réponse
    let mut plan = response_plan.clone();
    aegis.execute_response_plan(&mut plan).expect("Échec de l'exécution du plan de réponse");
    
    assert_eq!(plan.status, aegis::ResponsePlanStatus::Completed);
}

/// Test d'intégration entre QuantumVault et AEGIS
#[test]
fn test_quantum_vault_aegis_integration() {
    // Initialisation des modules
    let quantum_config = quantum_vault::QuantumVaultConfig::default();
    let quantum = quantum_vault::QuantumVault::new(quantum_config);
    
    let aegis_config = aegis::AegisConfig::default();
    let mut aegis = aegis::AegisOrchestrator::new(aegis_config);
    aegis.initialize().expect("Échec de l'initialisation d'AEGIS");
    
    // Génération d'une paire de clés
    let keypair = quantum.generate_encryption_keypair()
        .expect("Échec de la génération de la paire de clés");
    
    // Chiffrement d'un message
    let message = b"Message secret pour le test d'integration";
    let encryption_result = quantum.encrypt(message, &keypair.public_key)
        .expect("Échec du chiffrement");
    
    // Création d'un événement de menace avec des données chiffrées
    let mut metadata = HashMap::new();
    metadata.insert("encrypted_data".to_string(), base64::encode(&encryption_result.ciphertext));
    
    let threat_event = aegis::ThreatEvent {
        id: String::from("threat-test-2"),
        threat_type: aegis::ThreatType::DataExfiltration,
        severity: aegis::ThreatSeverity::High,
        confidence: 0.92,
        source: String::from("192.168.1.200"),
        target: String::from("192.168.1.1"),
        timestamp: SystemTime::now(),
        metadata,
    };
    
    // Traitement de l'événement par AEGIS
    let response_plan = aegis.process_threat_event(threat_event)
        .expect("Échec du traitement de l'événement de menace");
    
    // Vérification des résultats
    assert_eq!(response_plan.priority, 70); // Priorité pour High severity
}

/// Test d'intégration entre Dashboard et AEGIS
#[test]
fn test_dashboard_aegis_integration() {
    // Initialisation des modules
    let dashboard_config = dashboard::DashboardConfig::default();
    let mut dashboard = dashboard::Dashboard::new(dashboard_config);
    dashboard.start().expect("Échec du démarrage du dashboard");
    
    let aegis_config = aegis::AegisConfig::default();
    let mut aegis = aegis::AegisOrchestrator::new(aegis_config);
    aegis.initialize().expect("Échec de l'initialisation d'AEGIS");
    
    // Création d'un événement de menace
    let threat_event = aegis::ThreatEvent {
        id: String::from("threat-test-3"),
        threat_type: aegis::ThreatType::SqlInjection,
        severity: aegis::ThreatSeverity::Critical,
        confidence: 0.98,
        source: String::from("192.168.1.150"),
        target: String::from("192.168.1.5"),
        timestamp: SystemTime::now(),
        metadata: HashMap::new(),
    };
    
    // Traitement de l'événement par AEGIS
    let response_plan = aegis.process_threat_event(threat_event)
        .expect("Échec du traitement de l'événement de menace");
    
    // Création d'une visualisation dans le dashboard
    let scene = dashboard.process_threat_for_visualization(
        &response_plan.id,
        "sql_injection",
        5, // Critical severity
        &response_plan.threat_event.source,
        &response_plan.threat_event.target
    ).expect("Échec de la création de la visualisation");
    
    // Vérification des résultats
    assert_eq!(scene.visualization_type, dashboard::VisualizationType::Network3D);
    assert!(!scene.elements.is_empty());
}

/// Test d'intégration entre WarpShield et NeuroFireWall
#[test]
fn test_warpshield_neurofirewall_integration() {
    // Initialisation des modules
    let warpshield_config = warpshield::WarpShieldConfig::default();
    let mut warpshield = warpshield::WarpShield::new(warpshield_config);
    warpshield.initialize().expect("Échec de l'initialisation de WarpShield");
    
    let neurofirewall_config = neurofirewall::NeuroFireWallConfig::default();
    let mut neurofirewall = neurofirewall::NeuroFireWall::new(neurofirewall_config);
    neurofirewall.initialize().expect("Échec de l'initialisation de NeuroFireWall");
    
    // Création d'un environnement virtuel
    let env = warpshield.create_virtual_environment(warpshield::VirtualEnvironmentType::WebServer)
        .expect("Échec de la création de l'environnement virtuel");
    
    // Activation de l'environnement
    warpshield.activate_environment(&env.id, "192.168.1.100")
        .expect("Échec de l'activation de l'environnement");
    
    // Création d'un paquet réseau
    let packet = neurofirewall::NetworkPacket {
        id: String::from("packet-test-1"),
        source_ip: "192.168.1.100".to_string(),
        destination_ip: env.virtual_ip.clone(),
        source_port: 12345,
        destination_port: 80,
        protocol: "TCP".to_string(),
        size: 1024,
        timestamp: SystemTime::now(),
        traffic_type: neurofirewall::TrafficType::Web,
        payload_sample: vec![0, 1, 2, 3, 4],
        metadata: HashMap::new(),
    };
    
    // Analyse du paquet par NeuroFireWall
    let (decision, _) = neurofirewall.analyze_packet(packet)
        .expect("Échec de l'analyse du paquet");
    
    // Enregistrement d'un événement d'attaque dans WarpShield
    let mut data = HashMap::new();
    data.insert("decision".to_string(), format!("{:?}", decision));
    
    let attack_event = warpshield.record_attack_event(&env.id, "web_scan", data)
        .expect("Échec de l'enregistrement de l'événement d'attaque");
    
    // Vérification des résultats
    assert_eq!(attack_event.environment_id, env.id);
    assert_eq!(attack_event.attack_type, "web_scan");
}

/// Test d'intégration complet entre tous les modules
#[test]
fn test_full_system_integration() {
    // Initialisation de tous les modules
    let neural_net_config = neural_net::NeuralNetConfig::default();
    let neural_net = neural_net::NeuralNet::new(neural_net_config);
    
    let quantum_config = quantum_vault::QuantumVaultConfig::default();
    let quantum = quantum_vault::QuantumVault::new(quantum_config);
    
    let aegis_config = aegis::AegisConfig::default();
    let mut aegis = aegis::AegisOrchestrator::new(aegis_config);
    aegis.initialize().expect("Échec de l'initialisation d'AEGIS");
    
    let dashboard_config = dashboard::DashboardConfig::default();
    let mut dashboard = dashboard::Dashboard::new(dashboard_config);
    dashboard.start().expect("Échec du démarrage du dashboard");
    
    let warpshield_config = warpshield::WarpShieldConfig::default();
    let mut warpshield = warpshield::WarpShield::new(warpshield_config);
    warpshield.initialize().expect("Échec de l'initialisation de WarpShield");
    
    let neurofirewall_config = neurofirewall::NeuroFireWallConfig::default();
    let mut neurofirewall = neurofirewall::NeuroFireWall::new(neurofirewall_config);
    neurofirewall.initialize().expect("Échec de l'initialisation de NeuroFireWall");
    
    // Scénario d'intégration : détection et réponse à une attaque
    
    // 1. Création d'un environnement virtuel avec WarpShield
    let env = warpshield.create_virtual_environment(warpshield::VirtualEnvironmentType::WebServer)
        .expect("Échec de la création de l'environnement virtuel");
    warpshield.activate_environment(&env.id, "192.168.1.100")
        .expect("Échec de l'activation de l'environnement");
    
    // 2. Détection d'un paquet suspect avec NeuroFireWall
    let packet = neurofirewall::NetworkPacket {
        id: String::from("packet-test-full"),
        source_ip: "192.168.1.100".to_string(),
        destination_ip: env.virtual_ip.clone(),
        source_port: 12345,
        destination_port: 80,
        protocol: "TCP".to_string(),
        size: 1024,
        timestamp: SystemTime::now(),
        traffic_type: neurofirewall::TrafficType::Web,
        payload_sample: vec![0, 1, 2, 3, 4],
        metadata: HashMap::new(),
    };
    
    let (decision, detection_event) = neurofirewall.analyze_packet(packet)
        .expect("Échec de l'analyse du paquet");
    
    // 3. Enregistrement d'un événement d'attaque dans WarpShield
    let mut data = HashMap::new();
    data.insert("decision".to_string(), format!("{:?}", decision));
    
    let attack_event = warpshield.record_attack_event(&env.id, "web_attack", data)
        .expect("Échec de l'enregistrement de l'événement d'attaque");
    
    // 4. Création d'un événement de menace pour AEGIS
    let threat_event = aegis::ThreatEvent {
        id: String::from("threat-test-full"),
        threat_type: aegis::ThreatType::SqlInjection,
        severity: aegis::ThreatSeverity::Critical,
        confidence: 0.98,
        source: "192.168.1.100".to_string(),
        target: env.virtual_ip.clone(),
        timestamp: SystemTime::now(),
        metadata: HashMap::new(),
    };
    
    // 5. Traitement de l'événement par AEGIS
    let response_plan = aegis.process_threat_event(threat_event)
        .expect("Échec du traitement de l'événement de menace");
    
    // 6. Exécution du plan de réponse
    let mut plan = response_plan.clone();
    aegis.execute_response_plan(&mut plan).expect("Échec de l'exécution du plan de réponse");
    
    // 7. Création d'une visualisation dans le dashboard
    let scene = dashboard.process_threat_for_visualization(
        &response_plan.id,
        "sql_injection",
        5, // Critical severity
        &response_plan.threat_event.source,
        &response_plan.threat_event.target
    ).expect("Échec de la création de la visualisation");
    
    // 8. Génération d'une signature d'attaque
    let signature = warpshield.generate_attack_signature(
        &env.id,
        "SQL Injection Pattern",
        "Signature for SQL injection attacks targeting web servers"
    ).expect("Échec de la génération de la signature d'attaque");
    
    // Vérifications finales
    assert_eq!(plan.status, aegis::ResponsePlanStatus::Completed);
    assert!(!scene.elements.is_empty());
    assert_eq!(signature.name, "SQL Injection Pattern");
    
    // Nettoyage
    warpshield.terminate_environment(&env.id).expect("Échec de la terminaison de l'environnement");
    dashboard.stop().expect("Échec de l'arrêt du dashboard");
    neurofirewall.shutdown().expect("Échec de l'arrêt de NeuroFireWall");
    aegis.shutdown().expect("Échec de l'arrêt d'AEGIS");
}
