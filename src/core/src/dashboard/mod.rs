use serde::Serialize;

// The data structure for our dashboard API response.
#[derive(Serialize)]
pub struct DashboardData {
    pub system_status: String,
    pub active_threats: u32,
    pub analyzed_packets: u64,
    pub quantum_vault_status: String,
}

// A function to get mock data.
// In the future, this function will aggregate data from other core modules.
pub fn get_mock_data() -> DashboardData {
    DashboardData {
        system_status: "Operational".to_string(),
        active_threats: 5,
        analyzed_packets: 1_234_567_890,
        quantum_vault_status: "Secured".to_string(),
    }
} 