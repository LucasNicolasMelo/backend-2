import { userDTO } from "./user.dto.js";

export function ticketDTO(ticket) {
    const populatedUser =
        ticket.user &&
        typeof ticket.user === "object" &&
        ticket.user._id;

    return {
        id: ticket._id,

        user: populatedUser
            ? userDTO(ticket.user)
            : ticket.user,

        event: ticket.event,
        status: ticket.status,
        quantity: ticket.quantity,
        reservationCode: ticket.reservationCode,
        createdAt: ticket.createdAt,
        cancelledAt: ticket.cancelledAt
    };
}