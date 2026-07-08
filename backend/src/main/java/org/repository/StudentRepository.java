package org.repository;

import org.models.Student;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

/*
 * Marks this class as an Application Scoped CDI Bean.
 *
 * Quarkus creates and manages a single instance of this repository
 * for the entire lifetime of the application.
 *
 * Because it is a managed bean, it can be injected into other
 * classes (such as StudentService) using @Inject instead of
 * creating it manually with the 'new' keyword.
 */
@ApplicationScoped
public class StudentRepository implements PanacheRepository<Student> {

    /*
     * By implementing PanacheRepository<Student>, this repository
     * automatically gains a rich set of CRUD operations for the
     * Student entity.
     *
     * Some inherited methods include:
     *
     * - persist(student)      -> Save a new student
     * - listAll()             -> Retrieve all students
     * - findById(id)          -> Find a student by its ID
     * - delete(student)       -> Delete a student
     * - count()               -> Count all students
     * - find(...)             -> Create custom queries
     *
     * Because these methods are already implemented by Panache,
     * we don't need to write common database operations ourselves.
     */

    /*
     * This class starts empty because Panache already provides
     * the standard CRUD functionality.
     *
     * As the application grows, custom database queries can be
     * added here to keep all persistence logic in one place.
     *
     * Example:
     *
     * public Student findByEmail(String email) {
     *     return find("email", email).firstResult();
     * }
     */
}