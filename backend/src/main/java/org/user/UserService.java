package org.user;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
public class UserService {

    private final UserRepository repository;
    private final UserMapper mapper;

    @Inject
    public UserService(UserRepository repository, UserMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<UserDto> findAll() {
        return repository.listAll().stream()
                .map(entity -> mapper.toDto((User) entity))
                .collect(Collectors.toList());
    }

    public Optional<UserDto> findById(Long id) {
        return Optional.ofNullable(repository.findById(id))
                .map(mapper::toDto);
    }

    public Optional<UserDto> findByEmail(String email) {
        return repository.findByEmail(email)
                .map(mapper::toDto);
    }

    @Transactional
    public UserDto create(UserDto userDto) {
        if (repository.findByEmail(userDto.email()).isPresent()) {
            throw new jakarta.ws.rs.WebApplicationException(
                    "A user with that email already exists.",
                    jakarta.ws.rs.core.Response.Status.CONFLICT);
        }

        User user = mapper.toEntity(userDto);
        user.setId(null);

        repository.persist(user);
        return mapper.toDto(user);
    }

    @Transactional
    public Optional<UserDto> update(Long id, UserDto updatedUser) {

        User existing = repository.findById(id);

        if (existing == null) {
            return Optional.empty();
        }

        existing.setName(updatedUser.name());
        existing.setEmail(updatedUser.email());

        return Optional.of(mapper.toDto(existing));
    }

    @Transactional
    public boolean delete(Long id) {

        return repository.deleteById(id);
    }
}