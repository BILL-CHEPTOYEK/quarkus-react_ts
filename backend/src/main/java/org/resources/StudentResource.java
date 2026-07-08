package org.resources;

import org.models.Student;
import org.services.StudentService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/*
 * Exposes REST endpoints for managing students.
 *
 * The Resource layer is responsible for translating HTTP requests
 * into service method calls and translating the service results
 * into HTTP responses.
 *
 * Business rules and database operations belong in the service layer,
 * keeping this class simple and focused on HTTP communication.
 */
@Path("/students")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class StudentResource {

    /*
     * Injects the StudentService managed by Quarkus.
     *
     * Dependency Injection (DI) allows Quarkus to create and manage
     * the service instance, improving maintainability and testability.
     */
    @Inject
    StudentService studentService;

    /*
     * Retrieves all students.
     *
     * Endpoint:
     * GET /students
     *
     * Returns:
     * 200 OK with a JSON array of students.
     */
    @GET
    public Response getAllStudents() {
        return Response.ok(studentService.getAllStudents()).build();
    }

    /*
     * Retrieves a single student using its unique ID.
     *
     * Endpoint:
     * GET /students/{id}
     *
     * @PathParam extracts the value from the URL and passes it
     * as a method parameter.
     *
     * Returns:
     * 200 OK if found.
     *
     * If the student does not exist, the service should throw
     * NotFoundException, which Quarkus converts into
     * HTTP 404 Not Found.
     */
    @GET
    @Path("/{id}")
    public Response getStudentById(@PathParam("id") Long id) {
        return Response.ok(studentService.getStudentById(id)).build();
    }

    /*
     * Creates a new student.
     *
     * Endpoint:
     * POST /students
     *
     * Quarkus automatically converts the incoming JSON request
     * into a Student object before calling this method.
     *
     * Returns:
     * 201 Created when the student is successfully saved.
     */
    @POST
    public Response createStudent(Student student) {
        studentService.createStudent(student);

        return Response.status(Response.Status.CREATED).build();
    }

    /*
     * Updates an existing student.
     *
     * Endpoint:
     * PUT /students/{id}
     *
     * The student's ID comes from the URL while the updated
     * information comes from the request body.
     *
     * Returns:
     * 200 OK when the update succeeds.
     */
    @PUT
    @Path("/{id}")
    public Response updateStudent(@PathParam("id") Long id, Student student) {
        studentService.updateStudent(id, student);

        return Response.ok().build();
    }

    /*
     * Deletes a student.
     *
     * Endpoint:
     * DELETE /students/{id}
     *
     * Returns:
     * 204 No Content when the deletion succeeds.
     *
     * 204 indicates the operation completed successfully and
     * there is no response body to return.
     */
    @DELETE
    @Path("/{id}")
    public Response deleteStudent(@PathParam("id") Long id) {
        studentService.deleteStudent(id);

        return Response.noContent().build();
    }
}