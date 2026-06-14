package org.user;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.notNullValue;

@QuarkusTest
class UserResourceTest {

        @Test
        void shouldCreateReadUpdateAndDeleteUser() {
                int userId = given()
                                .contentType(ContentType.JSON)
                                .body("""
                                                {
                                                  "name": "Ada Lovelace",
                                                  "email": "ada.lovelace@example.com"
                                                }
                                                """)
                                .when()
                                .post("/users")
                                .then()
                                .statusCode(201)
                                .body("id", notNullValue())
                                .body("name", is("Ada Lovelace"))
                                .extract()
                                .path("id");

                given()
                                .when()
                                .get("/users/" + userId)
                                .then()
                                .statusCode(200)
                                .body("name", is("Ada Lovelace"))
                                .body("email", is("ada.lovelace@example.com"));

                given()
                                .contentType(ContentType.JSON)
                                .body("""
                                                {
                                                  "name": "Ada Byron",
                                                  "email": "ada.byron@example.com"
                                                }
                                                """)
                                .when()
                                .put("/users/" + userId)
                                .then()
                                .statusCode(200)
                                .body("name", is("Ada Byron"))
                                .body("email", is("ada.byron@example.com"));

                given()
                                .when()
                                .get("/users/lookup?email=ada.byron@example.com")
                                .then()
                                .statusCode(200)
                                .body("id", is(userId))
                                .body("email", is("ada.byron@example.com"));

                given()
                                .when()
                                .delete("/users/" + userId)
                                .then()
                                .statusCode(204);

                given()
                                .when()
                                .get("/users/" + userId)
                                .then()
                                .statusCode(404);
        }

        @Test
        void shouldRejectInvalidPayload() {
                given()
                                .contentType(ContentType.JSON)
                                .body("""
                                                {
                                                  "name": "",
                                                  "email": "not-an-email"
                                                }
                                                """)
                                .when()
                                .post("/users")
                                .then()
                                .statusCode(400);
        }
}