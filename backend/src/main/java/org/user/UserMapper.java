package org.user;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UserMapper {

	public UserDto toDto(User user) {
		return new UserDto(user.getId(), user.getName(), user.getEmail());
	}

	public User toEntity(UserDto userDto) {
		User user = new User(userDto.name(), userDto.email());
		user.setId(userDto.id());
		return user;
	}
}
