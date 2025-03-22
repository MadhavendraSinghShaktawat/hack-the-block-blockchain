use candid::{CandidType, Deserialize, Principal};
use ic_cdk::{query, update, pre_upgrade, post_upgrade, storage, api::time};
use std::cell::RefCell;
use std::collections::HashMap;

// Existing user-related types and data structures 
// (keep whatever exists here intact)

// Project-related types
#[derive(CandidType, Deserialize, Clone)]
struct Project {
    id: u64,
    title: String,
    description: String,
    creator: Principal,
    created_at: u64,
    collaborators: Vec<Principal>,
}

#[derive(CandidType, Deserialize)]
struct ProjectInput {
    title: String,
    description: String,
}

#[derive(CandidType, Deserialize)]
enum CreateProjectError {
    UserNotRegistered,
    InvalidInput,
    InternalError,
}

#[derive(CandidType, Deserialize)]
struct CreateProjectResult {
    project_id: Option<u64>,
    error: Option<CreateProjectError>,
}

// Thread-local storage for projects
thread_local! {
    static PROJECTS: RefCell<HashMap<u64, Project>> = RefCell::new(HashMap::new());
    static NEXT_PROJECT_ID: RefCell<u64> = RefCell::new(1);
}

// Existing code...
// ... (keep all existing functions and storage definitions)

#[update]
fn create_project(input: ProjectInput) -> CreateProjectResult {
    let caller = ic_cdk::caller();
    
    // Validate input
    if input.title.trim().is_empty() || input.description.trim().is_empty() {
        return CreateProjectResult {
            project_id: None,
            error: Some(CreateProjectError::InvalidInput),
        };
    }
    
    // Create and store the project
    let project_id = NEXT_PROJECT_ID.with(|id| {
        let current_id = *id.borrow();
        *id.borrow_mut() = current_id + 1;
        current_id
    });
    
    let now = time(); // timestamp in nanoseconds
    
    let project = Project {
        id: project_id,
        title: input.title,
        description: input.description,
        creator: caller,
        created_at: now,
        collaborators: vec![caller], // Creator is automatically a collaborator
    };
    
    // Store the project
    PROJECTS.with(|projects| {
        projects.borrow_mut().insert(project_id, project.clone());
    });
    
    CreateProjectResult {
        project_id: Some(project_id),
        error: None,
    }
}

#[query]
fn get_project(id: u64) -> Option<Project> {
    PROJECTS.with(|projects| {
        projects.borrow().get(&id).cloned()
    })
}

#[query]
fn get_user_projects(user: Principal) -> Vec<Project> {
    PROJECTS.with(|projects| {
        projects
            .borrow()
            .values()
            .filter(|p| p.creator == user || p.collaborators.contains(&user))
            .cloned()
            .collect()
    })
}

#[query]
fn get_all_projects() -> Vec<Project> {
    PROJECTS.with(|projects| {
        projects
            .borrow()
            .values()
            .cloned()
            .collect()
    })
}

// Query to match the expected interface
#[query]
fn get_projects() -> Vec<Project> {
    get_all_projects()
}

// Simple greeting function for testing
#[query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

// Pre-upgrade hook to save the state before canister upgrade
#[pre_upgrade]
fn pre_upgrade_hook() {
    PROJECTS.with(|projects| {
        let projects_data = projects.borrow();
        storage::stable_save((projects_data.clone(), NEXT_PROJECT_ID.with(|id| *id.borrow()))).unwrap();
    });
}

// Post-upgrade hook to restore the state after canister upgrade
#[post_upgrade]
fn post_upgrade_hook() {
    let (projects_data, next_id): (HashMap<u64, Project>, u64) = storage::stable_restore().unwrap();
    
    PROJECTS.with(|projects| {
        *projects.borrow_mut() = projects_data;
    });
    
    NEXT_PROJECT_ID.with(|id| {
        *id.borrow_mut() = next_id;
    });
}

// Candid interface generation
candid::export_service!();

#[query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    __export_service()
}
