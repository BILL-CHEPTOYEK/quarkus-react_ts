package org.models;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/*
 * Marks this class as a JPA Entity.
 *
 * Hibernate will map this Java class to a table in the database.
 * Each Student object represents one row in that table.
 */
@Entity

/*
 * Specifies the exact database table name.
 *
 * Without this annotation, Hibernate would use the class name
 * (Student) as the default table name.
 */
@Table(name = "students")

/*
 * Lombok generates getter methods for every field during compilation.
 *
 * Instead of manually writing:
 *   public String getFirstName() { return firstName; }
 *
 * Lombok creates them automatically, reducing boilerplate code.
 */
@Getter

/*
 * Lombok generates setter methods for every field.
 *
 * This saves us from writing repetitive methods like:
 *   public void setAge(Integer age) { this.age = age; }
 */
@Setter

/*
 * JPA requires a no-argument constructor.
 *
 * Hibernate uses this constructor internally when reading
 * data from the database and creating Student objects.
 */
@NoArgsConstructor

/*
 * Generates a constructor containing every field.
 *
 * Useful for testing or creating fully populated objects
 * without calling multiple setter methods.
 */
@AllArgsConstructor
public class Student{

    /*
     * Marks this field as the Primary Key.
     *
     * Every database table should have a unique identifier
     * so each record can be uniquely located, updated or deleted.
     */
    @Id

    /*
     * Instructs the database to generate IDs automatically.
     *
     * We don't manually assign IDs because the database can
     * guarantee uniqueness and prevent duplicate values.
     *
     * IDENTITY tells the database to use its auto-increment feature.
     */
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * Student's first name.
     *
     * This becomes a column named "firstName"
     * unless a @Column annotation specifies otherwise.
     */

    @Column(name = "first_name")
    private String firstName;

    /*
     * Student's last name.
     */
    @Column(name = "last_name")
    private String lastName;

    /*
     * Stores the student's email address.
     *
     * This is currently just a String.
     * Validation (such as checking email format)
     * should be handled separately using Bean Validation.
     */
    private String email;

    /*
     * Stores the student's age.
     *
     * Integer is used instead of int so the value can
     * be null before it is assigned or loaded.
     */
    private Integer age;
}