package org.user;

import org.jboss.logging.Logger;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class UserService {

    private static final Logger LOG = Logger.getLogger(UserService.class);

    @Inject
    UserRepository repository;

    public List<User> findAll() {

        LOG.debug("Fetching all users from database");

        List<User> users = repository.listAll();

        LOG.debugf("Database returned %d users", users.size());

        return users;
    }

    public Optional<User> findById(Long id) {

        LOG.debugf("Searching user by id=%d", id);

        return Optional.ofNullable(repository.findById(id));
    }

    public Optional<User> findByEmail(String email) {

        LOG.debugf("Searching user by email=%s", email);

        return repository.findByEmail(email);
    }

    @Transactional
    public User create(User user) {

        LOG.infof("Creating user email=%s", user.getEmail());

        if (repository.findByEmail(user.getEmail()).isPresent()) {
            LOG.warnf("Duplicate email detected: %s", user.getEmail());

            throw new WebApplicationException(
                    "A user with that email already exists.",
                    Response.Status.CONFLICT);
        }

        repository.persist(user);

        LOG.infof("User persisted successfully email=%s", user.getEmail());

        return user;
    }

    @Transactional
    public Optional<User> update(Long id, User updated) {

        LOG.infof("Updating user id=%d", id);

        User existing = repository.findById(id);

        if (existing == null) {
            LOG.warnf("Update failed - user not found id=%d", id);
            return Optional.empty();
        }

        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());

        LOG.infof("User updated id=%d", id);

        return Optional.of(existing);
    }

    @Transactional
    public boolean delete(Long id) {

        LOG.infof("Deleting user id=%d", id);

        boolean deleted = repository.deleteById(id);

        if (deleted) {
            LOG.infof("User deleted id=%d", id);
        } else {
            LOG.warnf("Delete failed - user not found id=%d", id);
        }

        return deleted;
    }
}