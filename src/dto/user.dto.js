export function userDTO(user) {
    return {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
    };
}

export function currentUserDTO(user) {
    return {
        id: user.id,
        email: user.email,
        role: user.role
    };
}