package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.interlink_back.entity.Role;
import tn.esprit.interlink_back.entity.User;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find a user by email (for login and uniqueness validation)
    User findByEmail(String email);


    @Query("SELECT u FROM User u WHERE u.firstName = :username")
    public User getUserByUsername(@Param("username") String username);
    // Find users by role (e.g., all students, all HRs, etc.)
    List<User> findByRole(Role role);

    // Check if a user with the given email already exists (for registration validation)
    boolean existsByEmail(String email);
    // Find all users with a given first or last name
    List<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);

    // Find all users within a specific role and email domain (e.g., esprit students)
    List<User> findByRoleAndEmailEndingWith(Role role, String domain);


    // Search users by first name, last name, or email (for admin or HR use)
    List<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String firstName, String lastName, String email);
}