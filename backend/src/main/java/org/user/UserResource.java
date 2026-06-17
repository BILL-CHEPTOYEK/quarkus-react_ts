package org.user;

import org.jboss.logging.Logger;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

    private static final Logger LOG = Logger.getLogger(UserResource.class);

    @Inject
    UserService service;

    @GET
    public List<User> getAllUsers() {

        LOG.info("GET /users called");

        List<User> users = service.findAll();

        LOG.infof("GET /users returned %d users", users.size());

        return users;
    }

    @GET
    @Path("/{id}")
    public Response getUserById(@PathParam("id") Long id) {

        LOG.infof("GET /users/%d called", id);

        return service.findById(id)
                .map(user -> {
                    LOG.infof("User found: id=%d", id);
                    return Response.ok(user).build();
                })
                .orElseGet(() -> {
                    LOG.warnf("User NOT found: id=%d", id);
                    return Response.status(Response.Status.NOT_FOUND).build();
                });
    }

    @GET
    @Path("/lookup")
    public Response getUserByEmail(@QueryParam("email") String email) {

        LOG.infof("GET /users/lookup called with email=%s", email);

        if (email == null || email.isBlank()) {
            LOG.warn("Email query param missing or blank");
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        return service.findByEmail(email.trim())
                .map(user -> {
                    LOG.infof("User found by email=%s", email);
                    return Response.ok(user).build();
                })
                .orElseGet(() -> {
                    LOG.warnf("User NOT found by email=%s", email);
                    return Response.status(Response.Status.NOT_FOUND).build();
                });
    }

    @POST
    public Response createUser(@Valid User user) {

        LOG.infof("POST /users called (email=%s)", user.getEmail());

        try {
            User created = service.create(user);

            LOG.infof("User created successfully id=%d email=%s",
                    created.getId(), created.getEmail());

            return Response.status(Response.Status.CREATED)
                    .entity(created)
                    .build();

        } catch (WebApplicationException e) {
            LOG.warnf("User creation failed: %s", e.getMessage());
            throw e;
        }
    }

    @PUT
    @Path("/{id}")
    public Response updateUser(@PathParam("id") Long id, @Valid User user) {

        LOG.infof("PUT /users/%d called", id);

        return service.update(id, user)
                .map(updated -> {
                    LOG.infof("User updated id=%d", id);
                    return Response.ok(updated).build();
                })
                .orElseGet(() -> {
                    LOG.warnf("Update failed, user not found id=%d", id);
                    return Response.status(Response.Status.NOT_FOUND).build();
                });
    }

    @DELETE
    @Path("/{id}")
    public Response deleteUser(@PathParam("id") Long id) {

        LOG.infof("DELETE /users/%d called", id);

        boolean deleted = service.delete(id);

        if (deleted) {
            LOG.infof("User deleted id=%d", id);
            return Response.noContent().build();
        } else {
            LOG.warnf("Delete failed, user not found id=%d", id);
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }
}