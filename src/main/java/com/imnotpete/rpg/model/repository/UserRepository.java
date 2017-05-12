package com.imnotpete.rpg.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.imnotpete.rpg.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
