use ic_cdk::export::{
    candid::{CandidType, Deserialize},
    Principal,
};
use ic_cdk::{caller, storage};
use std::collections::HashMap;
use std::cell::RefCell;

#[derive(Clone, Debug, CandidType, Deserialize)]
struct User {
    principal: Principal,
    registration_timestamp: u64,
}

thread_local! {
    static USERS: RefCell<HashMap<Principal, User>> = RefCell::new(HashMap::new());
}

/// Registers a user in the system if they haven't been registered before
/// 
/// @param principal - The principal ID of the user to register
/// @returns A result indicating success or failure with a message
#[ic_cdk::update]
fn register_user() -> RegisterUserResult {
    let caller_principal = caller();
    
    // Check if user is already registered
    let is_registered = USERS.with(|users| {
        users.borrow().contains_key(&caller_principal)
    });
    
    if is_registered {
        return RegisterUserResult {
            success: true,
            message: String::from("User already registered"),
            is_new_user: false,
        };
    }
    
    // Register new user
    let current_time = ic_cdk::api::time();
    let new_user = User {
        principal: caller_principal,
        registration_timestamp: current_time,
    };
    
    USERS.with(|users| {
        users.borrow_mut().insert(caller_principal, new_user);
    });
    
    RegisterUserResult {
        success: true,
        message: String::from("User registered successfully"),
        is_new_user: true,
    }
}

/// Check if a user is registered in the system
/// 
/// @returns Boolean indicating if the caller is registered
#[ic_cdk::query]
fn is_user_registered() -> bool {
    let caller_principal = caller();
    
    USERS.with(|users| {
        users.borrow().contains_key(&caller_principal)
    })
}

#[derive(CandidType, Deserialize)]
struct RegisterUserResult {
    success: bool,
    message: String,
    is_new_user: bool,
}

// Pre-upgrade hook to save users to stable storage
#[ic_cdk::pre_upgrade]
fn pre_upgrade() {
    USERS.with(|users| {
        let users_data = users.borrow();
        storage::stable_save((users_data.clone(),)).unwrap();
    });
}

// Post-upgrade hook to restore users from stable storage
#[ic_cdk::post_upgrade]
fn post_upgrade() {
    let (users_data,): (HashMap<Principal, User>,) = storage::stable_restore().unwrap_or_default();
    USERS.with(|users| {
        *users.borrow_mut() = users_data;
    });
} 