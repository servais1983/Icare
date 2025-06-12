use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct DashboardData {
    status: String,
    active_threats: u32,
    monitored_endpoints: u32,
}

pub fn get_mock_data() -> DashboardData {
    DashboardData {
        status: "operational".to_string(),
        active_threats: 0,
        monitored_endpoints: 1,
    }
} 