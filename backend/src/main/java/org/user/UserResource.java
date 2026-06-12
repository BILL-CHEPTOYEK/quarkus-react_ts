package com.example.user;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

    @Inject
    UserService service;

    // GET /users
    @GET
    public List<User> getAllUsers() {
        return service.findAll();
    }

    // GET /users/1
    @GET
    @Path("/{id}")
    public Response getUserById(
            @PathParam("id") Long id) {

        User user = service.findById(id);

        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .build();
        }

        return Response.ok(user).build();
    }

    // POST /users
    @POST
    public Response createUser(User user) {

        User created = service.create(user);

        return Response.status(Response.Status.CREATED)
                .entity(created)
                .build();
    }

    // PUT /users/1
    @PUT
    @Path("/{id}")
    public Response updateUser(
            @PathParam("id") Long id,
            User user) {

        User updated = service.update(id, user);

        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .build();
        }

        return Response.ok(updated).build();
    }

    // DELETE /users/1
    @DELETE
    @Path("/{id}")
    public Response deleteUser(
            @PathParam("id") Long id) {

        boolean deleted = service.delete(id);

        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND)
                    .build();
        }

        return Response.noContent().build();
    }
}