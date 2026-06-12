package com.example.user;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class UserService {

    @Inject
    UserRepository repository;

    public List<User> findAll() {
        return repository.listAll();
    }

    public User findById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public User create(User user) {
        repository.persist(user);
        return user;
    }

    @Transactional
    public User update(Long id, User updatedUser) {

        User existing = repository.findById(id);

        if (existing == null) {
            return null;
        }

        existing.name = updatedUser.name;
        existing.email = updatedUser.email;

        return existing;
    }

    @Transactional
    public boolean delete(Long id) {

        User user = repository.findById(id);

        if (user == null) {
            return false;
        }

        repository.delete(user);

        return true;
    }
}