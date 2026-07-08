package org.services;

import org.models.Student;
import org.repository.StudentRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.jboss.logging.Logger;

import java.util.List;

/*
 * Marks this class as an Application Scoped CDI Bean.
 *
 * Quarkus creates a single instance of this service and manages
 * its lifecycle throughout the application's lifetime.
 *
 * The Service layer contains the application's business logic.
 * It acts as the bridge between the Resource layer and the
 * Repository layer.
 */
@ApplicationScoped
public class StudentService {

    /*
     * Creates a logger for this class.
     *
     * Logging is typically performed in the service layer because
     * this is where business operations occur.
     */
    private static final Logger LOG = Logger.getLogger(StudentService.class);

    /*
     * Injects the repository responsible for interacting
     * with the database.
     *
     * Using Dependency Injection keeps this class loosely coupled
     * and makes it easier to test and maintain.
     */
    @Inject
    StudentRepository repository;

    /*
     * Retrieves every student stored in the database.
     *
     * Since this operation only reads data, a transaction
     * is not required.
     */
    public List<Student> getAllStudents() {

        LOG.info("Retrieving all students.");

        return repository.listAll();
    }

    /*
     * Retrieves a student by its unique ID.
     *
     * If no student exists with the given ID,
     * a NotFoundException is thrown.
     *
     * Quarkus automatically converts this exception
     * into an HTTP 404 Not Found response.
     */
    public Student getStudentById(Long id) {

        LOG.infof("Retrieving student with ID: %d", id);

        Student student = repository.findById(id);

        if (student == null) {
            LOG.warnf("Student with ID %d was not found.", id);
            throw new NotFoundException("Student not found.");
        }

        return student;
    }

    /*
     * Creates a new student.
     *
     * @Transactional ensures that all database operations
     * performed within this method either complete successfully
     * or are rolled back if an error occurs.
     */
    @Transactional
    public void createStudent(Student student) {

        LOG.infof("Creating student: %s %s",
                student.getFirstName(),
                student.getLastName());

        repository.persist(student);

        LOG.infof("Student created successfully with ID: %d", student.getId());
    }

    /*
     * Updates an existing student.
     *
     * The existing student is first retrieved from the database.
     * If it doesn't exist, a NotFoundException is thrown.
     *
     * Because the retrieved entity is managed by Hibernate,
     * updating its fields inside a transaction is enough.
     * Hibernate automatically detects the changes and
     * synchronizes them with the database when the
     * transaction completes.
     */
    @Transactional
    public void updateStudent(Long id, Student updatedStudent) {

        LOG.infof("Updating student with ID: %d", id);

        Student student = repository.findById(id);

        if (student == null) {
            LOG.warnf("Student with ID %d was not found.", id);
            throw new NotFoundException("Student not found.");
        }

        student.setFirstName(updatedStudent.getFirstName());
        student.setLastName(updatedStudent.getLastName());
        student.setEmail(updatedStudent.getEmail());
        student.setAge(updatedStudent.getAge());

        LOG.infof("Student with ID %d updated successfully.", id);
    }

    /*
     * Deletes a student from the database.
     *
     * The student must exist before it can be deleted.
     *
     * If no matching student exists,
     * a NotFoundException is thrown.
     */
    @Transactional
    public void deleteStudent(Long id) {

        LOG.infof("Deleting student with ID: %d", id);

        Student student = repository.findById(id);

        if (student == null) {
            LOG.warnf("Student with ID %d was not found.", id);
            throw new NotFoundException("Student not found.");
        }

        repository.delete(student);

        LOG.infof("Student with ID %d deleted successfully.", id);
    }
}