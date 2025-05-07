package tn.esprit.interlink_back.repository;

import tn.esprit.interlink_back.entity.FaceDescriptor;
import tn.esprit.interlink_back.entity.User;
import java.util.Optional;

public interface FaceRecognitionService {
    /**
     * Extracts a face descriptor from the given image bytes.
     */
    FaceDescriptor extractDescriptor(byte[] imageBytes);

    /**
     * Finds and returns a user whose stored face descriptor matches
     * the provided descriptor within an acceptable threshold.
     */
    Optional<User> findMatchingUser(FaceDescriptor descriptor);
}