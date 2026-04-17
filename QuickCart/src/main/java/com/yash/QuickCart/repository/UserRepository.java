package com.yash.QuickCart.repository;

import com.yash.QuickCart.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserRepository - Database operations for User entity
 */
@Repository
    public interface UserRepository extends JpaRepository<User, Long> {

        Optional<User> findByEmail(String email);

        boolean existsByEmail(String email);
}
